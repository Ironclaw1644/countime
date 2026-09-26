import type { CalcResult } from '@/lib/fsa/calc';
import { cn } from '@/lib/cn';

const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const days = (a: string, b: string) => Math.round((t(b) - t(a)) / 86_400_000);
const short = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

type Seg = { key: string; label: string; from: string; to: string; className: string; pattern?: boolean };

/**
 * The whole sentence on one ruled bar: time inside, time in the community,
 * and the stretches that credits and good conduct time take off the end.
 * A stacked bar plus a legend rather than labels on the bar, so it reads the
 * same at 390px as at 1440px, and prints.
 */
export function Timeline({ result: r }: { result: CalcResult }) {
  const start = r.commenced;
  const end = r.fullTerm;
  const total = Math.max(1, days(start, end));
  const pre = r.earliestPrerelease < r.projectedRelease ? r.earliestPrerelease : r.projectedRelease;
  const ftcPre = r.ftc.prereleaseDate ?? r.projectedRelease;

  // Remanded at sentencing: the stretch in county jail or Marshals holding
  // before reaching the designated prison.
  const arrived = r.arrival < pre ? r.arrival : pre;

  const segs: Seg[] = [
    {
      key: 'transit',
      label: r.arrivalAssumed ? 'Waiting to be moved to prison (estimated)' : 'Waiting to be moved to prison',
      from: start,
      to: arrived,
      className: 'bg-tone-holding',
    },
    { key: 'inside', label: 'In a BOP prison', from: arrived, to: pre, className: 'bg-ink' },
    { key: 'sca', label: 'Second Chance Act placement (assumed)', from: pre, to: ftcPre < pre ? pre : ftcPre, className: 'bg-sodium-deep' },
    { key: 'ftc-pre', label: 'Halfway house or home confinement — FSA credits', from: ftcPre, to: r.projectedRelease, className: 'bg-accent' },
    { key: 'sr', label: 'Supervised release starts early — FSA credits', from: r.projectedRelease, to: r.afterRdap, className: 'bg-state-open', pattern: true },
    { key: 'rdap', label: 'RDAP early release', from: r.afterRdap, to: r.statutoryRelease, className: 'bg-tone-rdap', pattern: true },
    { key: 'gct', label: 'Good conduct time', from: r.statutoryRelease, to: end, className: 'bg-ink-faint', pattern: true },
  ].filter((s) => days(s.from, s.to) > 0);

  const years: number[] = [];
  for (let y = Number(start.slice(0, 4)) + 1; y <= Number(end.slice(0, 4)); y++) years.push(y);
  const step = years.length > 8 ? 2 : 1;

  return (
    <figure className="mt-5">
      <div className="relative">
        {/* Year ticks */}
        <div className="relative h-6" aria-hidden>
          {years
            .filter((_, i) => i % step === 0)
            .map((y) => {
              const x = (days(start, `${y}-01-01`) / total) * 100;
              return (
                <span key={y} className="tabular absolute top-0 -translate-x-1/2 text-xs text-ink-faint" style={{ left: `${x}%` }}>
                  {y}
                </span>
              );
            })}
        </div>
        <div
          className="flex h-14 w-full overflow-hidden rounded-sm border border-rule-strong"
          role="img"
          aria-label={`Timeline from ${short(start)} to ${short(end)}: ${segs.map((s) => `${s.label} ${days(s.from, s.to)} days`).join('; ')}.`}
        >
          {segs.map((s) => (
            <div
              key={s.key}
              className={cn('bar-grow h-full', s.className)}
              style={{
                width: `${(days(s.from, s.to) / total) * 100}%`,
                backgroundImage: s.pattern
                  ? 'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.28) 0 2px, transparent 2px 7px)'
                  : undefined,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>Sentence begins {short(start)}</span>
          <span>Full term {short(end)}</span>
        </div>
      </div>

      <figcaption>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {segs.map((s) => (
            <li key={s.key} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn('mt-1 h-3.5 w-3.5 shrink-0 rounded-[2px]', s.className)}
                style={{
                  backgroundImage: s.pattern
                    ? 'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.35) 0 2px, transparent 2px 5px)'
                    : undefined,
                }}
              />
              <span className="text-sm leading-snug">
                <span className="text-ink">{s.label}</span>
                <span className="block text-xs text-ink-muted">
                  {short(s.from)} → {short(s.to)} · <span className="tabular">{days(s.from, s.to).toLocaleString()}</span> days
                </span>
              </span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
