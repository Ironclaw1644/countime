import { cn } from '@/lib/cn';

/** A hairline. Does the work borders and card edges used to. */
export function Rule({ className, strong }: { className?: string; strong?: boolean }) {
  return (
    <hr
      className={cn('border-0 border-t', strong ? 'border-rule-strong' : 'border-rule', className)}
    />
  );
}
