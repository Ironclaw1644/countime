import { cn } from '@/lib/cn';
import type { Scripture } from '@/data/scripture';

/**
 * A single quotation set large in the display face — used for the scripture
 * interstitials between sections. Pass `verse` for scripture (the reference
 * becomes the attribution) or `children` + `attribution` for anything else.
 */
export function PullQuote({
  children,
  verse,
  attribution,
  align = 'center',
  className,
}: {
  children?: React.ReactNode;
  verse?: Scripture;
  attribution?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  const text = verse ? verse.text : children;
  const cite = verse ? verse.ref : attribution;
  return (
    <figure
      data-reveal
      className={cn('max-w-4xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}
    >
      <blockquote className="quote-text text-3xl leading-[1.15] text-ink sm:text-4xl">
        <span aria-hidden className="text-accent">&ldquo;</span>
        {text}
        <span aria-hidden className="text-accent">&rdquo;</span>
      </blockquote>
      {cite && (
        <figcaption
          className={cn('mt-6 flex items-center gap-4', align === 'center' && 'justify-center')}
        >
          <span aria-hidden className="h-px w-8 bg-accent" />
          <span className="eyebrow">{cite}</span>
          {align === 'center' && <span aria-hidden className="h-px w-8 bg-accent" />}
        </figcaption>
      )}
    </figure>
  );
}
