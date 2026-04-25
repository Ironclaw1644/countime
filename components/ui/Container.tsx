import { cn } from '@/lib/cn';

export function Container({
  children,
  className,
  width = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  width?: 'narrow' | 'default' | 'wide' | 'bleed';
}) {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-[88rem]',
    bleed: 'max-w-none',
  };
  return (
    <div className={cn('mx-auto px-5 sm:px-8', widths[width], className)}>
      {children}
    </div>
  );
}
