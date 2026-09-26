'use client';

import { useEffect, useId, useMemo, useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  calculate,
  DEFAULT_INPUT,
  fromSearchParams,
  rdapCapFor,
  toSearchParams,
  type CalcInput,
  type CalcResult,
  type Risk,
} from '@/lib/fsa/calc';
import { SOURCES, type SourceId } from '@/lib/fsa/rules';
import { Timeline } from './Timeline';
import { cn } from '@/lib/cn';

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });

const RISKS: { v: Risk; label: string }[] = [
  { v: 'minimum', label: 'Minimum' },
  { v: 'low', label: 'Low' },
  { v: 'medium', label: 'Medium' },
  { v: 'high', label: 'High' },
];

/**
 * The calculator. State lives in the URL (replaceState on every change) so a
 * result can be shared, bookmarked or printed exactly as seen.
 */
export function Calculator() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<CalcInput>(() => (params.size ? fromSearchParams(params) : DEFAULT_INPUT));
  const result = useMemo(() => calculate(input), [input]);
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<CalcInput>) => {
    const next = { ...input, ...patch };
    setInput(next);
    const qs = toSearchParams(next).toString();
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title: 'Release date estimate — Countime', url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
      {/* ── Inputs ─────────────────────────────────────────── */}
      <form
        className="print:hidden"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Sentence details"
      >
        <Fieldset n="01" legend="The sentence">
          <Field label="Date the sentence began" hint="Self-surrender date, or the day taken into custody to serve it.">
            <input
              type="date"
              value={input.start}
              min="2018-12-21"
              max="2060-12-31"
              onChange={(e) => e.target.value && update({ start: e.target.value })}
              className="input"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <NumberField label="Years" value={input.years} min={0} max={60} onChange={(v) => update({ years: v })} />
            <NumberField label="Months" value={input.months} min={0} max={11} onChange={(v) => update({ months: v })} />
            <NumberField label="Days" value={input.days} min={0} max={30} onChange={(v) => update({ days: v })} />
          </div>
          <NumberField
            label="Jail credit (days)"
            hint="Days in custody before the sentence began that the court or BOP credits — § 3585(b)."
            value={input.jailCreditDays}
            min={0}
            max={3650}
            onChange={(v) => update({ jailCreditDays: v })}
          />
        </Fieldset>

        <Fieldset n="02" legend="First Step Act">
          <Field
            label="Can they earn time credits?"
            hint="No if the offense is on the excluded list, or there is a final order of removal."
            group
          >
            <Segmented
              name="fsa"
              value={input.fsaEligible ? 'yes' : 'no'}
              options={[
                { v: 'yes', label: 'Yes' },
                { v: 'no', label: 'No' },
              ]}
              onChange={(v) => update({ fsaEligible: v === 'yes' })}
            />
            <a href="#excluded" className="mt-2 inline-block text-xs text-accent underline underline-offset-4">
              Check the list of excluded offenses
            </a>
          </Field>
          <Field label="PATTERN risk level" hint="Ask the unit team for the level on record." group>
            <Segmented
              name="risk"
              value={input.risk}
              options={RISKS.map((r) => ({ v: r.v, label: r.label }))}
              onChange={(v) => update({ risk: v as Risk })}
            />
          </Field>
          <Field label="Does the judgment include supervised release?" group>
            <Segmented
              name="sr"
              value={input.supervisedRelease ? 'yes' : 'no'}
              options={[
                { v: 'yes', label: 'Yes' },
                { v: 'no', label: 'No' },
              ]}
              onChange={(v) => update({ supervisedRelease: v === 'yes' })}
            />
          </Field>
        </Fieldset>

        <Fieldset n="03" legend="Programs & placement">
          <Toggle
            label="Completes RDAP"
            hint={`Drug program early release — up to ${rdapCapFor(result.sentenceMonths)} months for this sentence length.`}
            checked={input.rdap}
            onChange={(v) => update({ rdap: v })}
          />
          {input.rdap && (
            <Range
              label="RDAP reduction to assume"
              value={Math.min(input.rdapMonths, rdapCapFor(result.sentenceMonths))}
              min={0}
              max={rdapCapFor(result.sentenceMonths)}
              unit="months"
              onChange={(v) => update({ rdapMonths: v })}
            />
          )}
          <Range
            label="Second Chance Act placement to assume"
            hint="BOP decides this case by case (up to 12 months). Leave at 0 for credits alone."
            value={input.scaMonths}
            min={0}
            max={12}
            unit="months"
            onChange={(v) => update({ scaMonths: v })}
          />
          <Toggle
            label="Has a diploma or GED (or is working toward one)"
            hint="Without one, good conduct time is 42 days a year instead of 54."
            checked={input.diploma}
            onChange={(v) => update({ diploma: v })}
          />
        </Fieldset>

        <details className="group mt-2 border-t border-rule pt-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            Fine-tune the assumptions
            <span aria-hidden className="text-accent transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="mt-5 space-y-5">
            <Range
              label="Time in earning status"
              hint="BOP’s own projection assumes 100%. Opt-outs, segregation and outside trips pause earning."
              value={Math.round(input.participation * 100)}
              min={0}
              max={100}
              step={5}
              unit="%"
              onChange={(v) => update({ participation: v / 100 })}
            />
            <NumberField
              label="Days before earning starts"
              hint="e.g. days in transit before arrival, if BOP doesn’t credit them (see the Sept. 30, 2026 rule below)."
              value={input.earningDelayDays}
              min={0}
              max={365}
              onChange={(v) => update({ earningDelayDays: v })}
            />
            <NumberField
              label="30-day periods at 10 before 15 applies"
              hint="BOP’s handout uses 7. Only matters for minimum/low risk."
              value={input.basePeriods}
              min={0}
              max={240}
              onChange={(v) => update({ basePeriods: v })}
            />
          </div>
        </details>

        <button
          type="button"
          onClick={() => {
            setInput(DEFAULT_INPUT);
            router.replace(pathname, { scroll: false });
          }}
          className="mt-6 text-xs text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Reset to the example
        </button>
      </form>

      {/* ── Results ────────────────────────────────────────── */}
      <MobileResultBar result={result} />
      <div id="estimate" aria-live="polite" className="min-w-0 scroll-mt-20">
        <Results result={result} />
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-on transition-colors hover:bg-accent-hover"
          >
            {copied ? 'Link copied' : 'Share this estimate'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-sunk"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────

function Results({ result: r }: { result: CalcResult }) {
  const hasPre = r.earliestPrerelease < r.projectedRelease;
  const heroDate = hasPre ? r.earliestPrerelease : r.projectedRelease;
  const today = useToday();
  const daysUntil = today ? Math.round((Date.parse(`${heroDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000) : null;
  const savedDays = Math.round((Date.parse(`${r.fullTerm}T00:00:00Z`) - Date.parse(`${r.projectedRelease}T00:00:00Z`)) / 86_400_000);

  return (
    <section aria-label="Estimate">
      <div className="band-night overflow-hidden rounded-sm px-6 py-8 sm:px-10 sm:py-10">
        <p className="eyebrow !text-accent">{hasPre ? 'Earliest move home (RRC or home confinement)' : 'Projected release'}</p>
        <p className="numeral mt-4 text-[clamp(3rem,2rem+5vw,6rem)] uppercase text-ink">
          {fmtDate(heroDate, { month: 'short', day: 'numeric' })}
          <span className="ml-3 text-ink-faint">{heroDate.slice(0, 4)}</span>
        </p>
        {daysUntil !== null && daysUntil > 0 && (
          <p className="mt-2 text-sm text-ink-soft">
            About <strong className="text-ink">{daysUntil.toLocaleString()}</strong> days from today.
          </p>
        )}

        <dl className="mt-8 grid gap-6 border-t border-rule pt-6 sm:grid-cols-3">
          <Big
            label={r.ftc.appliedToSupervisedRelease > 0 ? 'Supervised release begins' : 'Release from BOP custody'}
            value={fmtDate(r.projectedRelease, { month: 'short', day: 'numeric', year: 'numeric' })}
          />
          <Big label="Full term would end" value={fmtDate(r.fullTerm, { month: 'short', day: 'numeric', year: 'numeric' })} />
          <Big label="Time off the full term" value={`${savedDays.toLocaleString()} days`} />
        </dl>
      </div>

      <div className="mt-10">
        <h2 className="eyebrow">Timeline</h2>
        <Timeline result={r} />
      </div>

      <div className="mt-12">
        <h2 className="eyebrow">How we got there</h2>
        <table className="mt-4 w-full border-t border-rule text-sm">
          <caption className="sr-only">Step-by-step calculation</caption>
          <tbody>
            <Row label="Sentence imposed" value={`${r.termDays.toLocaleString()} days`} sub={`${r.input.years}y ${r.input.months}m ${r.input.days}d from ${fmtDate(r.input.start)}`} cite={['usc-3585']} />
            {r.input.jailCreditDays > 0 && (
              <Row label="Jail credit" value={`− ${r.input.jailCreditDays} days`} cite={['usc-3585']} />
            )}
            <Row label="Full term" value={fmtDate(r.fullTerm)} strong />
            <Row
              label="Good conduct time"
              value={r.gctEligible ? `− ${r.gctDays} days` : 'none'}
              sub={
                r.gctEligible
                  ? `${r.input.diploma ? 54 : 42} a year on the sentence imposed, partial year prorated`
                  : 'Only sentences of more than 1 year earn it'
              }
              cite={['usc-3624b', 'cfr-523-20']}
            />
            <Row label="Release with good conduct time" value={fmtDate(r.statutoryRelease)} strong />
            {r.rdapMonthsApplied > 0 && (
              <>
                <Row label="RDAP early release" value={`− ${r.rdapMonthsApplied} months`} sub={`Cap for this sentence: ${r.rdapCapMonths} months`} cite={['usc-3621e', 'ps-5331']} />
                <Row label="Release after RDAP" value={fmtDate(r.afterRdap)} strong />
              </>
            )}
            {r.ftc.eligible && (
              <Row
                label="FSA time credits earned"
                value={`${r.ftc.earnedByRelease.toLocaleString()} days`}
                sub={r.ftc.canApply ? 'By the day they’re applied — 10 per 30 days served, 15 after the first seven periods' : `${r.ftc.ratePer30} per 30 days served`}
                cite={['usc-3632d4', 'ps-5410']}
              />
            )}
            {r.ftc.appliedToSupervisedRelease > 0 && (
              <Row label="→ to early supervised release" value={`− ${r.ftc.appliedToSupervisedRelease} days`} sub="Up to 12 months" cite={['usc-3624g', 'cfr-523-44']} />
            )}
            {r.ftc.towardPrerelease > 0 && (
              <Row label="→ to halfway house / home confinement" value={`${r.ftc.towardPrerelease} days`} sub={`From ${fmtDate(r.ftc.prereleaseDate!)}`} cite={['usc-3624g', 'ps-5410']} />
            )}
            {r.sca.assumedDays > 0 && (
              <Row label="+ Second Chance Act placement (assumed)" value={`${r.sca.assumedDays} days`} sub={`From ${fmtDate(r.earliestPrerelease)}`} cite={['usc-3624c', 'ps-5410']} />
            )}
            <Row label={r.ftc.appliedToSupervisedRelease > 0 ? 'Supervised release begins' : 'Projected release'} value={fmtDate(r.projectedRelease)} strong />
            {r.releaseWeekday !== r.projectedRelease && (
              <Row
                label="Falls on a weekend — may release the weekday before"
                value={fmtDate(r.releaseWeekday, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                cite={['usc-3624a']}
              />
            )}
          </tbody>
        </table>

        {r.ftc.blocker && (
          <p className="mt-6 border-l-2 border-state-warn pl-4 text-sm leading-relaxed text-ink-soft">{r.ftc.blocker}</p>
        )}
        {r.notes.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm leading-relaxed text-ink-muted">
            {r.notes.map((n) => (
              <li key={n} className="border-l border-rule-strong pl-4">
                {n}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs leading-relaxed text-ink-muted">
          Served before release: {r.daysServedToRelease.toLocaleString()} days, about {r.percentOfTermServed}% of the
          sentence imposed. Second Chance Act home confinement would be capped at {r.sca.homeConfinementCapDays} days
          for this term (from {fmtDate(r.sca.homeConfinementFrom)}).
        </p>
      </div>
    </section>
  );
}

/** On phones the form comes first, so keep the answer in view until the results are. */
function MobileResultBar({ result: r }: { result: CalcResult }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById('estimate');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.boundingClientRect.top < window.innerHeight * 0.9), {
      threshold: [0, 0.01, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const hasPre = r.earliestPrerelease < r.projectedRelease;
  return (
    <a
      href="#estimate"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={cn(
        'band-night fixed inset-x-3 bottom-3 z-30 flex overflow-hidden items-center justify-between gap-4 rounded-full px-5 py-3 shadow-lift transition-all duration-300 lg:hidden print:hidden',
        hidden ? 'pointer-events-none translate-y-6 opacity-0' : 'opacity-100',
      )}
    >
      <span className="text-xs text-ink-soft">{hasPre ? 'Earliest move home' : 'Projected release'}</span>
      <span className="numeral text-xl text-accent">
        {fmtDate(hasPre ? r.earliestPrerelease : r.projectedRelease, { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
      <span aria-hidden className="text-ink">↓</span>
    </a>
  );
}

function useToday(): string | null {
  // Server and first client render agree on null; the real date arrives after hydration.
  return useSyncExternalStore(
    () => () => {},
    () => new Date().toISOString().slice(0, 10),
    () => null,
  );
}

function Big({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="numeral mt-1.5 text-3xl text-ink">{value}</dd>
    </div>
  );
}

function Row({ label, value, sub, cite, strong }: { label: string; value: string; sub?: string; cite?: SourceId[]; strong?: boolean }) {
  return (
    <tr className={cn('border-b border-rule align-baseline', strong && 'bg-paper-raised/60')}>
      <th scope="row" className={cn('py-3 pr-4 text-left font-normal', strong ? 'text-ink' : 'text-ink-soft')}>
        <span className={cn(strong && 'font-semibold')}>{label}</span>
        {sub && <span className="mt-0.5 block text-xs text-ink-muted">{sub}</span>}
      </th>
      <td className={cn('whitespace-nowrap py-3 text-right tabular', strong ? 'font-semibold text-ink' : 'text-ink-soft')}>
        {value}
        {cite && (
          <span className="ml-2 inline-flex gap-1 align-super">
            {cite.map((c) => (
              <a
                key={c}
                href={`#rule-${c}`}
                className="inline-flex h-6 min-w-6 items-center justify-center text-[0.75rem] font-normal text-accent hover:underline"
                aria-label={`Source: ${SOURCES[c].cite}`}
                title={SOURCES[c].cite}
              >
                §
              </a>
            ))}
          </span>
        )}
      </td>
    </tr>
  );
}

// ── Form controls ─────────────────────────────────────────────────────────

function Fieldset({ n, legend, children }: { n: string; legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-8 border-t border-rule pt-5">
      <legend className="contents">
        <span className="flex items-baseline gap-3">
          <span className="numeral text-lg text-accent">{n}</span>
          <span className="font-display text-2xl text-ink">{legend}</span>
        </span>
      </legend>
      <div className="mt-5 space-y-5">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  hint,
  group = false,
  children,
}: {
  label: string;
  hint?: string;
  /** For radio groups: a labelled group instead of a <label>, which can't nest. */
  group?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  const head = (
    <>
      <span id={id} className="block text-sm font-medium text-ink">
        {label}
      </span>
      {hint && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{hint}</span>}
    </>
  );
  if (group)
    return (
      <div role="group" aria-labelledby={id}>
        {head}
        <div className="mt-2">{children}</div>
      </div>
    );
  return (
    <label className="block">
      {head}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function NumberField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
        className="input numeral text-xl"
      />
    </Field>
  );
}

function Segmented({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: { v: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <label
          key={o.v}
          className={cn(
            'cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent',
            value === o.v ? 'border-ink bg-ink text-paper' : 'border-rule-strong text-ink-soft hover:border-ink',
          )}
        >
          <input
            type="radio"
            name={name}
            value={o.v}
            checked={value === o.v}
            onChange={() => onChange(o.v)}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </span>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{hint}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-rule-strong bg-paper-sunk transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-[1.125rem] after:w-[1.125rem] after:rounded-full after:bg-ink-muted after:transition-transform peer-checked:border-accent peer-checked:bg-accent peer-checked:after:translate-x-5 peer-checked:after:bg-accent-on peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      />
    </label>
  );
}

function Range({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="numeral text-xl text-accent">
          {value}
          <span className="ml-1 text-xs font-normal text-ink-muted">{unit}</span>
        </span>
      </span>
      {hint && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{hint}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[rgb(var(--accent))]"
      />
    </label>
  );
}
