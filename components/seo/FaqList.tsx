import { cn } from '@/lib/cn';

/** Native <details> accordion — works without JavaScript, and every answer is in the HTML for crawlers. */
export function FaqList({ faqs, className }: { faqs: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn('border-t border-rule', className)}>
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-rule">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent">
              {f.q}
            </span>
            <span
              aria-hidden
              className="numeral text-2xl text-accent transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-prose pb-6 leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
