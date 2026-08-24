import { cn } from '@/lib/cn';

export type ChipTone = 'neutral' | 'accent' | 'women' | 'medical' | 'holding' | 'rdap' | 'warn' | 'closed';

/**
 * One definition of the attribute pill, replacing the four near-identical
 * copies that had drifted across the tooltip, facility page, handbook card
 * and checklist.
 */
const TONES: Record<ChipTone, string> = {
  neutral: 'border-rule text-ink-muted',
  accent: 'border-accent/40 text-accent',
  women: 'border-tone-women/45 text-tone-women',
  medical: 'border-tone-medical/45 text-tone-medical',
  holding: 'border-tone-holding/45 text-tone-holding',
  rdap: 'border-tone-rdap/50 text-tone-rdap',
  warn: 'border-state-warn/50 text-state-warn',
  closed: 'border-state-closed/45 text-state-closed',
};

export function Chip({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-2xs font-medium uppercase tracking-[0.08em]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
