import { cn } from '@/lib/cn';

/**
 * The letterspaced uppercase micro-label used above headings and beside
 * section numbers — an echo of the ".NET" set into the logotype.
 */
export function Eyebrow({
  children,
  className,
  as: As = 'p',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h2';
}) {
  return <As className={cn('eyebrow', className)}>{children}</As>;
}
