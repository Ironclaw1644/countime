import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TallyMark } from '@/components/ui/Tally';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PullQuote } from '@/components/ui/PullQuote';
import { GUIDES } from '@/data/guides';
import { scripture } from '@/data/scripture';
import { JsonLd, pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Guides — First Step Act credits, PATTERN, RDAP, home confinement & self-surrender',
  ogTitle: 'Guides to the federal prison rules',
  description:
    'Plain-language guides to First Step Act time credits, PATTERN risk levels, RDAP, halfway house vs. home confinement, and self-surrender. Every statement links to its source.',
  path: '/guides',
});

export default function GuidesPage() {
  return (
    <>
      <section className="band-night overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14">
        <Container width="wide">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Eyebrow className="!text-accent">Guides</Eyebrow>
              <h1 className="mt-4 text-4xl text-ink lg:text-[4.25rem]">
                Guides to the federal prison rules
              </h1>
            </div>
            <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
              Short explainers on the parts of a federal sentence that decide when
              someone comes home. Every statement links to the statute, regulation
              or Bureau of Prisons document it comes from.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container width="wide">
          <ol className="grid gap-px border border-rule bg-rule md:grid-cols-2">
            {GUIDES.map((g, i) => (
              <li key={g.slug} data-reveal={String((i % 4) + 1)} className="bg-paper">
                <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col p-8 transition-colors hover:bg-paper-raised sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="tabular text-sm text-ink-faint transition-colors group-hover:text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <TallyMark count={(i % 5) + 1} className="h-7 w-9 text-ink-faint group-hover:text-accent" />
                  </div>
                  <h2 className="mt-6 text-2xl text-ink">{g.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{g.description}</p>
                  <span className="mt-auto pt-8 text-sm font-semibold text-ink">
                    Read · {g.readingTime} min <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <PullQuote verse={scripture('1-thessalonians-5-11')} />
        </Container>
      </section>

      <JsonLd
        data={{
          '@type': 'ItemList',
          name: 'Countime guides',
          itemListElement: GUIDES.map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/guides/${g.slug}`,
            name: g.title,
          })),
        }}
      />
    </>
  );
}
