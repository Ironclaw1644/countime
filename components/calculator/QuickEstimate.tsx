'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { calculate, DEFAULT_INPUT, toSearchParams, type CalcInput } from '@/lib/fsa/calc';

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/**
 * The home page's "when?" card: the sentence, the sentencing date and time
 * locked up before it; two dates out; one link into the full calculator
 * carrying the same numbers.
 */
export function QuickEstimate() {
  const [input, setInput] = useState<CalcInput>(DEFAULT_INPUT);
  const r = useMemo(() => calculate(input), [input]);
  const set = (p: Partial<CalcInput>) => setInput((i) => ({ ...i, ...p }));
  const hasPre = r.earliestPrerelease < r.projectedRelease;

  return (
    <div className="border border-rule bg-paper-raised/70 p-6 shadow-lift backdrop-blur sm:p-8">
      <div className="flex items-center justify-between">
        <p className="eyebrow !text-accent">Quick estimate</p>
        <span className="text-2xs uppercase tracking-wider text-ink-faint">First Step Act</span>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <span className="text-sm font-semibold text-ink">How much time did you get?</span>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <Unit unit="years" value={input.years} max={60} onChange={(v) => set({ years: v })} />
            <Unit unit="months" value={input.months} max={11} onChange={(v) => set({ months: v })} />
          </div>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-ink">When were you sentenced?</span>
          <input
            type="date"
            className="input mt-1.5"
            value={input.sentenced}
            onChange={(e) => e.target.value && set({ sentenced: e.target.value })}
          />
        </label>
        <div>
          <span className="text-sm font-semibold text-ink">Locked up before sentencing?</span>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <Unit unit="years" value={input.priorYears} max={20} onChange={(v) => set({ priorYears: v })} />
            <Unit unit="months" value={input.priorMonths} max={11} onChange={(v) => set({ priorMonths: v })} />
          </div>
        </div>
      </div>

      <dl className="mt-6 space-y-4 border-t border-rule pt-5">
        {hasPre && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-soft">Home confinement / RRC from</dt>
            <dd className="numeral text-xl text-accent">{fmt(r.earliestPrerelease)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-ink-soft">{r.ftc.appliedToSupervisedRelease > 0 ? 'Supervised release' : 'Release'}</dt>
          <dd className="numeral text-xl text-ink">{fmt(r.projectedRelease)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-ink-muted">Full term</dt>
          <dd className="tabular text-base text-ink-faint line-through decoration-1">{fmt(r.fullTerm)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        Assumes you were in custody at sentencing, low risk, supervised release, and credits from the day your
        sentence starts (the Sept. 30, 2026 rule). An estimate. BOP computes the official date.
      </p>
      <Link
        href={`/calculator?${toSearchParams(input).toString()}`}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent hover:text-accent-on"
      >
        See the full timeline <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function Unit({ unit, value, max, onChange }: { unit: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <span className="relative block">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        aria-label={unit}
        className="input tabular pr-16 text-lg"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(Math.max(0, Math.min(max, Math.floor(Number(e.target.value) || 0))))}
      />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-ink-muted">
        {unit}
      </span>
    </span>
  );
}
