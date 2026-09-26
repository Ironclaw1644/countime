import Link from 'next/link';
import { cn } from '@/lib/cn';

export const RULE_GUIDE_HREF = '/guides/fsa-credits-from-sentencing-2026-rule';

/**
 * The September 30, 2026 interim rule (91 FR 55740), announced where people
 * land: the home page hero and the calculator. Wording matches the rule —
 * credits can start when the sentence commences, but only for assigned
 * programming actually done.
 */
export function RuleCallout({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <aside
      aria-label="New rule, September 30, 2026"
      className={cn(
        'relative grid gap-4 overflow-hidden rounded-sm border border-accent/50 bg-accent/[0.08] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6',
        className,
      )}
    >
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1 sm:border-r sm:border-accent/30 sm:pr-6">
        <span className="rounded-full bg-accent px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.12em] text-accent-on">
          New rule
        </span>
        <span className="text-sm font-semibold text-ink sm:mt-1">
          Sept. 30, 2026
        </span>
      </div>
      <div>
        <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-2xl">
          First Step Act credits can start the day your sentence starts, not the day you get to prison.
        </p>
        {!compact && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
            If you were kept in custody at sentencing, the weeks in county jail or Marshals holding before you reach
            your prison can now count, as long as you’re doing the programs you’ve been assigned. BOP says that wait
            averages 66 days.
          </p>
        )}
      </div>
      <Link
        href={RULE_GUIDE_HREF}
        className="inline-flex items-center gap-2 justify-self-start whitespace-nowrap rounded-full border border-ink/80 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:bg-accent hover:text-accent-on"
      >
        What changed <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
