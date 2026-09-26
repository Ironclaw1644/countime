'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { calculate, DEFAULT_INPUT, toSearchParams, type CalcInput } from '@/lib/fsa/calc';

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/**
 * The home page's "when?" card: three inputs, two dates, one link into the
 * full calculator carrying the same numbers.
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
      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="col-span-2 block">
          <span className="text-xs text-ink-muted">Sentence begins</span>
          <input
            type="date"
            className="input mt-1"
            value={input.start}
            onChange={(e) => e.target.value && set({ start: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-xs text-ink-muted">Years</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={60}
            className="input numeral mt-1 text-xl"
            value={input.years}
            onChange={(e) => set({ years: Math.max(0, Math.min(60, Number(e.target.value) || 0)) })}
          />
        </label>
        <label className="block">
          <span className="text-xs text-ink-muted">Months</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={11}
            className="input numeral mt-1 text-xl"
            value={input.months}
            onChange={(e) => set({ months: Math.max(0, Math.min(11, Number(e.target.value) || 0)) })}
          />
        </label>
      </div>

      <dl className="mt-6 space-y-4 border-t border-rule pt-5">
        {hasPre && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-soft">Home confinement / RRC from</dt>
            <dd className="numeral text-2xl text-accent">{fmt(r.earliestPrerelease)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-ink-soft">{r.ftc.appliedToSupervisedRelease > 0 ? 'Supervised release' : 'Release'}</dt>
          <dd className="numeral text-2xl text-ink">{fmt(r.projectedRelease)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-ink-muted">Full term</dt>
          <dd className="numeral text-lg text-ink-faint line-through decoration-1">{fmt(r.fullTerm)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        Assumes low risk, supervised release, and time credits from day one. An estimate — the Bureau computes the
        official date.
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
