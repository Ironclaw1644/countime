import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PullQuote } from '@/components/ui/PullQuote';
import { NewsList } from '@/components/news/NewsList';
import { getNews, FEEDS } from '@/lib/news/feeds';
import { GUIDES } from '@/data/guides';
import { scripture } from '@/data/scripture';
import { pageMetadata } from '@/lib/seo';

// Rebuilt at most once an hour; the feeds themselves are cached for the same
// hour in Next's data cache, so a burst of visitors costs one fetch per feed.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'First Step Act news — Bureau of Prisons updates, time credits & reentry',
  ogTitle: 'First Step Act & Bureau of Prisons news',
  description:
    'The latest First Step Act, FSA time credit, home confinement and Bureau of Prisons news, gathered hourly from BOP and DOJ press releases and major outlets — headlines and links only.',
  path: '/news',
});

const OFFICIAL_LINKS = [
  { label: 'BOP — First Step Act overview', href: 'https://www.bop.gov/inmates/fsa/' },
  { label: 'BOP — press releases', href: 'https://www.bop.gov/resources/press_releases.jsp' },
  { label: 'DOJ — Office of Public Affairs news', href: 'https://www.justice.gov/news' },
];

export default async function NewsPage() {
  const { items, failed, fetchedAt } = await getNews({ limit: 48 });
  const official = items.filter((i) => i.kind === 'official').slice(0, 6);
  const press = items.filter((i) => i.kind === 'press');

  return (
    <>
      <section className="band-night overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container width="wide">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'News', path: '/news' }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Eyebrow className="!text-accent">Updated hourly</Eyebrow>
              <h1 className="mt-4 text-4xl text-ink lg:text-[4.25rem]">
                First Step Act news
              </h1>
            </div>
            <div className="text-ink-soft">
              <p className="max-w-prose text-lg leading-relaxed">
                Time credits, home confinement, camp closures and Bureau of Prisons
                policy — gathered from the Bureau&rsquo;s own press releases, the
                Justice Department and major outlets.
              </p>
              <p className="mt-3 text-xs text-ink-muted">
                Headlines link to the original publisher. We don&rsquo;t copy articles.
                Last gathered{' '}
                <time dateTime={fetchedAt}>
                  {new Date(fetchedAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: 'America/New_York',
                    timeZoneName: 'short',
                  })}
                </time>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div>
              {items.length === 0 ? (
                <div className="border border-rule bg-paper-raised p-8">
                  <h2 className="text-2xl text-ink">The feeds didn&rsquo;t answer just now.</h2>
                  <p className="mt-3 max-w-prose text-ink-soft">
                    We gather this page from public news feeds, and none of them
                    responded on the last try. It will refresh on its own within the
                    hour. Meanwhile, the official sources are one click away:
                  </p>
                  <ul className="mt-5 space-y-2">
                    {OFFICIAL_LINKS.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  {official.length > 0 && (
                    <div className="mb-14">
                      <h2 className="eyebrow !text-accent">From the Bureau &amp; the Justice Department</h2>
                      <NewsList items={official} featured />
                    </div>
                  )}
                  <h2 className="eyebrow">In the press</h2>
                  <NewsList items={press} />
                </>
              )}
              {failed.length > 0 && items.length > 0 && (
                <p className="mt-8 text-xs text-ink-muted">
                  Not responding on the last refresh: {failed.join(', ')}.
                </p>
              )}
            </div>

            <aside className="space-y-12 lg:sticky lg:top-24 lg:self-start">
              <div>
                <h2 className="eyebrow">Understand the headlines</h2>
                <ul className="mt-4 border-t border-rule">
                  {GUIDES.map((g) => (
                    <li key={g.slug} className="border-b border-rule">
                      <Link href={`/guides/${g.slug}`} className="group block py-4">
                        <span className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent">
                          {g.title}
                        </span>
                        <span className="mt-1 block text-xs text-ink-muted">{g.readingTime} min read</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-rule bg-paper-raised p-6">
                <p className="eyebrow !text-accent">Calculator</p>
                <p className="mt-3 font-display text-2xl leading-tight text-ink">
                  What do the new credits mean for one sentence?
                </p>
                <Link
                  href="/calculator"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-accent hover:text-accent-on"
                >
                  Estimate a release date <span aria-hidden>→</span>
                </Link>
              </div>
              <div>
                <h2 className="eyebrow">Sources</h2>
                <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
                  {FEEDS.map((f) => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink-muted">
                  Camp closures and conversions have their own dated log:{' '}
                  <Link href="/updates" className="text-accent underline underline-offset-4">
                    facility updates
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="pb-8 pt-4">
        <Container>
          <PullQuote verse={scripture('proverbs-16-9')} />
        </Container>
      </section>
    </>
  );
}
