import { cn } from '@/lib/cn';

export function Section({
  children,
  className,
  id,
  as: As = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'article';
}) {
  return (
    <As id={id} className={cn('py-16 sm:py-24', className)}>
      {children}
    </As>
  );
}
