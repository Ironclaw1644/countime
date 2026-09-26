'use client';

import { useEffect, useId, useMemo, useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  calculate,
  DEFAULT_INPUT,
  fromSearchParams,
  priorCustodyDays,
  rdapCapFor,
  toSearchParams,
  type CalcInput,
  type CalcResult,
  type FtcRule,
  type Risk,
  type StartMode,
} from '@/lib/fsa/calc';
import { RULES, SOURCES, type SourceId } from '@/lib/fsa/rules';
import { Timeline } from './Timeline';
import { RULE_GUIDE_HREF } from '@/components/news/RuleCallout';
import { cn } from '@/lib/cn';

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });

/** "1 year, 6 months" — only the parts that aren't zero. */
const ymd = (y: number, m: number, d: number) =>
  [
    [y, 'year'],
    [m, 'month'],
    [d, 'day'],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, u]) => `${n} ${u}${n === 1 ? '' : 's'}`)
    .join(', ') || '0 days';

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
        <Fieldset legend="Your sentence">
          <Field label="How much time did you get?" sub="Term of imprisonment imposed" group>
            <div className="grid grid-cols-3 gap-3">
              <UnitField unit="years" value={input.years} max={60} onChange={(v) => update({ years: v })} />
              <UnitField unit="months" value={input.months} max={11} onChange={(v) => update({ months: v })} />
              <UnitField unit="days" value={input.days} max={30} onChange={(v) => update({ days: v })} optional />
            </div>
          </Field>
          <Field label="When were you sentenced?">
            <input
              type="date"
              value={input.sentenced}
              min="2018-12-21"
              max="2060-12-31"
              onChange={(e) => e.target.value && update({ sentenced: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Were you locked up when you were sentenced?" group>
            <Segmented
              name="how"
              value={input.startMode}
              options={[
                { v: 'custody', label: 'Yes, I stayed in custody' },
                { v: 'surrender', label: 'No, I report on my own' },
              ]}
              onChange={(v) => update({ startMode: v as StartMode })}
            />
          </Field>
          {input.startMode === 'custody' ? (
            <Field
              label="When did you get to your prison?"
              hint={`The BOP prison you were designated to, not county jail or a holding center. Not there yet? Leave it blank and we’ll use BOP’s average: ${RULES.avgDaysSentencingToArrival} days after sentencing.`}
            >
              <span className="flex gap-2">
                <input
                  type="date"
                  value={input.arrived}
                  min={input.sentenced}
                  max="2060-12-31"
                  onChange={(e) => update({ arrived: e.target.value })}
                  className="input"
                />
                {input.arrived && (
                  <button
                    type="button"
                    onClick={() => update({ arrived: '' })}
                    className="shrink-0 rounded-[3px] border border-rule-strong px-3 text-xs text-ink-muted hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </span>
            </Field>
          ) : (
            <Field label="What day do you report to prison?" hint="Your self-surrender date. Your sentence starts that day.">
              <input
                type="date"
                value={input.surrender}
                min={input.sentenced}
                max="2060-12-31"
                onChange={(e) => e.target.value && update({ surrender: e.target.value })}
                className="input"
              />
            </Field>
          )}
          <PriorCustody input={input} update={update} />
        </Fieldset>

        <Fieldset legend="First Step Act">
          {input.startMode === 'custody' && (
            <Field
              label="When do your credits start?"
              hint="A new BOP rule took effect September 30, 2026. Under it, credits can start the day your sentence starts, not the day you get to your prison."
              group
            >
              <Segmented
                name="rule"
                value={input.rule}
                options={[
                  { v: 'new', label: 'New rule: from sentencing' },
                  { v: 'old', label: 'Old rule: from arrival' },
                ]}
                onChange={(v) => update({ rule: v as FtcRule })}
              />
              <Link href={RULE_GUIDE_HREF} className="mt-2 inline-block text-xs text-accent underline underline-offset-4">
                What the Sept. 30 rule changed
              </Link>
            </Field>
          )}
          <Field
            label="Can you earn time credits?"
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
          <Field label="What’s your risk level?" sub="PATTERN score" hint="Your unit team can tell you the level on record." group>
            <Segmented
              name="risk"
              value={input.risk}
              options={RISKS.map((r) => ({ v: r.v, label: r.label }))}
              onChange={(v) => update({ risk: v as Risk })}
            />
          </Field>
          <Field label="Does your judgment include supervised release?" group>
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

        <Fieldset legend="Programs and placement">
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
            label="Have a diploma or GED (or working toward one)"
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
              label="Exact days of jail credit"
              hint="If you have BOP’s sentence computation, enter its prior-custody day count here. It replaces the years and months above. 0 = use those."
              value={input.priorExactDays}
              min={0}
              max={7300}
              onChange={(v) => update({ priorExactDays: v })}
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
        <p className="numeral mt-4 text-[clamp(2.75rem,1.9rem+4.2vw,5.25rem)] text-ink">
          {fmtDate(heroDate, { month: 'short', day: 'numeric' })},
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
            <Row label="Sentence imposed" value={`${r.termDays.toLocaleString()} days`} sub={`${ymd(r.input.years, r.input.months, r.input.days)}, starting ${fmtDate(r.commenced)}`} cite={['usc-3585']} />
            {r.priorCustodyDays > 0 && (
              <Row
                label="Time locked up before sentencing"
                value={`− ${r.priorCustodyDays.toLocaleString()} days`}
                sub={r.input.priorExactDays > 0 ? 'Exact count you entered' : `${ymd(r.input.priorYears, r.input.priorMonths, r.input.priorDays)}, counted back from ${fmtDate(r.input.sentenced)}`}
                cite={['usc-3585']}
              />
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
                sub={`Earned from ${fmtDate(r.earningFrom)}. ${r.ftc.canApply ? '10 per 30 days, then 15 after the first seven periods.' : `${r.ftc.ratePer30} per 30 days.`}`}
                cite={r.earningFrom < r.arrival ? ['usc-3632d4', 'ps-5410', 'fr-2026-17752'] : ['usc-3632d4', 'ps-5410']}
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

        <RuleCompare result={r} />
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
      <dd className="numeral mt-1.5 text-2xl text-ink">{value}</dd>
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

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-8 border-t border-rule pt-5">
      <legend className="contents">
        <span className="block font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{legend}</span>
      </legend>
      <div className="mt-5 space-y-5">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  sub,
  hint,
  group = false,
  children,
}: {
  label: string;
  /** The legal or official name, under the plain-language question. */
  sub?: string;
  hint?: string;
  /** For radio groups: a labelled group instead of a <label>, which can't nest. */
  group?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  const head = (
    <>
      <span id={id} className="block text-[0.9375rem] font-semibold text-ink">
        {label}
      </span>
      {sub && <span className="mt-0.5 block text-xs text-ink-faint">{sub}</span>}
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
        className="input tabular text-lg"
      />
    </Field>
  );
}

/** A number box with its unit written inside it: [ 5  years ]. */
function UnitField({
  unit,
  value,
  max,
  optional = false,
  onChange,
}: {
  unit: string;
  value: number;
  max: number;
  optional?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="relative block">
        <input
          type="number"
          inputMode="numeric"
          value={Number.isFinite(value) ? value : 0}
          min={0}
          max={max}
          onChange={(e) => onChange(Math.min(max, Math.max(0, Math.floor(Number(e.target.value) || 0))))}
          onFocus={(e) => e.target.select()}
          className="input tabular pr-[4.25rem] text-lg"
          aria-label={unit}
        />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-ink-muted">
          {unit}
        </span>
      </span>
      {optional && <span className="mt-1 block text-2xs text-ink-faint">optional</span>}
    </label>
  );
}

/** Time in custody before sentencing, asked the way people remember it. */
function PriorCustody({ input, update }: { input: CalcInput; update: (p: Partial<CalcInput>) => void }) {
  const days = priorCustodyDays(input.sentenced, input.priorYears, input.priorMonths, input.priorDays);
  const any = input.priorYears + input.priorMonths + input.priorDays > 0;
  return (
    <div role="group" aria-labelledby="prior-h">
      <span id="prior-h" className="block text-[0.9375rem] font-semibold text-ink">
        How much time were you locked up before your federal sentencing?
      </span>
      <span className="mt-0.5 block text-xs text-ink-faint">Prior custody credit, 18 U.S.C. § 3585(b)</span>
      <div className="mt-2 grid grid-cols-3 gap-3">
        <UnitField unit="years" value={input.priorYears} max={20} onChange={(v) => update({ priorYears: v })} />
        <UnitField unit="months" value={input.priorMonths} max={11} onChange={(v) => update({ priorMonths: v })} />
        <UnitField unit="days" value={input.priorDays} max={30} onChange={(v) => update({ priorDays: v })} optional />
      </div>
      {any && input.priorExactDays === 0 && (
        <p className="mt-2 text-xs text-ink-soft">
          That’s <strong className="tabular font-semibold text-ink">{days.toLocaleString()} days</strong>, counted back
          on the calendar from your sentencing date.
        </p>
      )}
      {input.priorExactDays > 0 && (
        <p className="mt-2 text-xs text-ink-soft">
          Using your exact count of <strong className="tabular font-semibold text-ink">{input.priorExactDays.toLocaleString()} days</strong> (under “Fine-tune”).
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        County jail, U.S. Marshals holding, or state custody after your arrest for this case all count. Time that was
        already counted toward another sentence, like a state sentence, usually doesn’t count again.{' '}
        <a href="#rule-usc-3585" className="text-accent underline underline-offset-4">
          Read § 3585(b)
        </a>
      </p>
    </div>
  );
}

/** Old rule vs new rule, shown only when the start of credits actually differs. */
function RuleCompare({ result: r }: { result: CalcResult }) {
  if (!r.compare) return null;
  const newIsPrimary = r.input.rule === 'new';
  const newDate = newIsPrimary ? r.earliestPrerelease : r.compare.earliestPrerelease;
  const oldDate = newIsPrimary ? r.compare.earliestPrerelease : r.earliestPrerelease;
  const gain = r.compare.newRuleGainDays;
  return (
    <div className="mt-6 border border-accent/40 bg-accent/[0.06] p-5 text-sm leading-relaxed">
      <p className="font-semibold text-ink">Sept. 30, 2026 rule vs. the old rule</p>
      {gain > 0 ? (
        <p className="mt-1.5 text-ink-soft">
          Counting credits from {fmtDate(r.commenced)} instead of {fmtDate(r.arrival)}
          {r.arrivalAssumed ? ' (estimated arrival)' : ''} moves your earliest date{' '}
          <strong className="text-ink">{gain} days</strong> sooner:{' '}
          <span className="tabular whitespace-nowrap">{fmtDate(newDate, { month: 'short', day: 'numeric', year: 'numeric' })}</span> under the new
          rule, <span className="tabular whitespace-nowrap">{fmtDate(oldDate, { month: 'short', day: 'numeric', year: 'numeric' })}</span> under the old one.
        </p>
      ) : (
        <p className="mt-1.5 text-ink-soft">
          Both rules give the same dates here. The extra credits from before you got to prison don’t move anything,
          usually because the 12-month limit or the length of the sentence is the limit.
        </p>
      )}
      <p className="mt-2 text-xs text-ink-muted">
        You still have to be in your assigned programs to earn, and the rule doesn’t say whether it covers time
        before September 30, 2026.{' '}
        <Link href={RULE_GUIDE_HREF} className="text-accent underline underline-offset-4">
          What’s settled and what isn’t
        </Link>
      </p>
    </div>
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
