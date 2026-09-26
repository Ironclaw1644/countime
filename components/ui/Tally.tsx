import { cn } from '@/lib/cn';

/**
 * Four strokes and a slash — the way days are counted on a wall. The site's
 * recurring mark: section dividers, list bullets, the calculator's progress.
 * Pure SVG in currentColor; `draw` strokes it on with dash-offset, which every
 * engine animates reliably (unlike masks — see the logotype notes).
 */
export function TallyMark({
  className,
  count = 5,
  draw = false,
}: {
  className?: string;
  /** 1–5 strokes; 5 includes the slash. */
  count?: number;
  draw?: boolean;
}) {
  const strokes = ['M6 4v24', 'M13 4v24', 'M20 4v24', 'M27 4v24'];
  return (
    <svg
      viewBox="0 0 34 32"
      aria-hidden
      className={cn('shrink-0 overflow-visible', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      {strokes.slice(0, Math.min(count, 4)).map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className={draw ? 'tally-draw' : undefined}
          style={draw ? { animationDelay: `${i * 140}ms` } : undefined}
        />
      ))}
      {count >= 5 && (
        <path
          d="M2 25 31 7"
          pathLength={1}
          className={draw ? 'tally-draw' : undefined}
          style={draw ? { animationDelay: '620ms' } : undefined}
        />
      )}
    </svg>
  );
}

/** A hairline with a tally mark set in the middle of it. */
export function TallyRule({ className }: { className?: string }) {
  return (
    <div className={cn('tally-rule', className)} role="separator">
      <TallyMark className="h-5 w-6" />
    </div>
  );
}
