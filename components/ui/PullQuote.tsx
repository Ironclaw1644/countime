import { cn } from '@/lib/cn';

export function PullQuote({
  children,
  attribution,
  className,
}: {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
}) {
  return (
    <figure className={cn('mx-auto max-w-3xl text-center', className)}>
      <blockquote className="font-display italic text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.15] tracking-tightest">
        <span className="text-clay/70 font-display select-none">&ldquo;</span>
        {children}
        <span className="text-clay/70 font-display select-none">&rdquo;</span>
      </blockquote>
      {attribution && (
        <figcaption className="mt-5 small-caps text-xs text-ink-muted">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
