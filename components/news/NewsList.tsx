import type { NewsItem } from '@/lib/news/feeds';
import { cn } from '@/lib/cn';

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });

/** Headline, source, date, link out. Nothing else is ours to reproduce. */
export function NewsList({ items, featured = false }: { items: NewsItem[]; featured?: boolean }) {
  return (
    <ol className="mt-4 border-t border-rule">
      {items.map((it) => (
        <li key={it.id} className="border-b border-rule">
          <a
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[7.5rem_1fr_auto] sm:items-baseline"
          >
            <time dateTime={it.published} className="numeral text-base text-ink-faint">
              {fmt(it.published)}
            </time>
            <span>
              <span
                className={cn(
                  'font-display leading-snug text-ink transition-colors group-hover:text-accent',
                  featured ? 'text-2xl' : 'text-xl',
                )}
              >
                {it.title}
              </span>
              <span className="mt-1 block text-xs text-ink-muted">
                {it.source}
                {it.kind === 'official' && (
                  <span className="ml-2 rounded-sm border border-accent/40 px-1.5 py-px text-2xs uppercase tracking-wider text-accent">
                    Official
                  </span>
                )}
              </span>
            </span>
            <span aria-hidden className="hidden text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-accent sm:block">
              ↗
            </span>
            <span className="sr-only">(opens the publisher&rsquo;s site in a new tab)</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
