import { cn } from '@/lib/cn';

export function Section({
  children,
  className,
  as: As = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
}) {
  return (
    <As className={cn('py-16 sm:py-24', className)}>{children}</As>
  );
}
