import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PullQuote } from '@/components/ui/PullQuote';
import { TallyMark } from '@/components/ui/Tally';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FaqList } from '@/components/seo/FaqList';
import { GUIDES, GUIDE_SOURCES, getGuide, type Block, type GuideSourceId } from '@/data/guides';
import { SCRIPTURE } from '@/data/scripture';
import { JsonLd, articleLd, faqLd, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return { title: 'Guide not found' };
  return pageMetadata({
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    type: 'article',
    publishedTime: g.published,
    modifiedTime: g.updated,
  });
}

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  // Number sources in order of first citation, so the footnotes read 1, 2, 3.
  const order: GuideSourceId[] = [];
  for (const s of guide.sections)
    for (const b of s.blocks) for (const c of b.cite ?? []) if (!order.includes(c)) order.push(c);
  const num = (id: GuideSourceId) => order.indexOf(id) + 1;

  const index = GUIDES.findIndex((g) => g.slug === guide.slug);
  const verse = SCRIPTURE[(index * 3 + 2) % SCRIPTURE.length];
  const related = guide.related.map((r) => getGuide(r)).filter(Boolean);
  const path = `/guides/${guide.slug}`;

  return (
    <article>
      <header className="band-night overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14">
        <Container>
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Guides', path: '/guides' },
              { name: guide.shortTitle, path },
            ]}
          />
          <Eyebrow className="mt-10 !text-accent">Guide · {guide.readingTime} min read</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-4xl text-ink lg:text-[3.5rem]">{guide.title}</h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ink-soft">{guide.lede}</p>
          {guide.keyFacts && (
            <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-sm border border-accent/40 bg-accent/30 md:grid-cols-4">
              {guide.keyFacts.map((f) => (
                <div key={f.label} className="bg-paper px-4 py-3.5">
                  <dt className="eyebrow !text-accent">{f.label}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-8 text-xs text-ink-muted">
            Updated <time dateTime={guide.updated}>{fmt(guide.updated)}</time> · Every statement is linked to the
            law or Bureau of Prisons document it comes from.
          </p>
        </Container>
      </header>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[14rem_1fr] lg:gap-20">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="eyebrow">On this page</p>
              <ol className="mt-4 space-y-3 border-l border-rule pl-4 text-sm">
                {guide.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a href={`#s${i + 1}`} className="text-ink-muted transition-colors hover:text-accent">
                      {s.heading}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#faq" className="text-ink-muted transition-colors hover:text-accent">
                    Questions
                  </a>
                </li>
                <li>
                  <a href="#sources" className="text-ink-muted transition-colors hover:text-accent">
                    Sources
                  </a>
                </li>
              </ol>
              <Link
                href="/calculator"
                className="mt-10 block border border-rule bg-paper-raised p-5 transition-colors hover:border-accent"
              >
                <span className="eyebrow !text-accent">Calculator</span>
                <span className="mt-2 block font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-ink">
                  See these rules applied to one sentence →
                </span>
              </Link>
            </nav>
          </aside>

          <div className="max-w-prose">
            {guide.sections.map((s, i) => (
              <section key={s.heading} id={`s${i + 1}`} className="scroll-mt-24 [&+&]:mt-14">
                <h2 className="text-3xl text-ink">{s.heading}</h2>
                <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.75] text-ink-soft">
                  {s.blocks.map((b, j) => (
                    <BlockView key={j} block={b} num={num} />
                  ))}
                </div>
              </section>
            ))}

            <div className="my-20">
              <PullQuote verse={verse} align="left" />
            </div>

            <section id="faq" className="scroll-mt-24">
              <h2 className="text-3xl text-ink">Questions people ask</h2>
              <FaqList faqs={guide.faqs} className="mt-6" />
            </section>

            <section id="sources" className="mt-16 scroll-mt-24 border-t border-rule pt-8">
              <h2 className="eyebrow">Sources</h2>
              <ol className="mt-5 space-y-4">
                {order.map((id) => {
                  const src = GUIDE_SOURCES[id];
                  return (
                    <li key={id} id={`src-${id}`} className="grid grid-cols-[2rem_1fr] gap-2 text-sm">
                      <span className="tabular font-semibold text-accent">{num(id)}</span>
                      <span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:text-accent"
                        >
                          {src.cite}
                        </a>
                        <span className="text-ink-muted"> — {src.title}</span>
                        <blockquote className="mt-1.5 border-l border-rule pl-3 text-xs italic leading-relaxed text-ink-muted">
                          “{src.quote}”
                        </blockquote>
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-8 text-xs leading-relaxed text-ink-muted">
                This guide explains public law and Bureau of Prisons policy. It is not legal advice, and the
                Bureau computes the official dates. Sources were read on {fmt(guide.updated)}.
              </p>
            </section>

            {related.length > 0 && (
              <nav aria-label="Related guides" className="mt-16">
                <p className="eyebrow">Related guides</p>
                <ul className="mt-4 border-t border-rule">
                  {related.map((r) => (
                    <li key={r!.slug} className="border-b border-rule">
                      <Link href={`/guides/${r!.slug}`} className="group flex items-center justify-between gap-4 py-5">
                        <span className="font-display text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-accent">
                          {r!.title}
                        </span>
                        <TallyMark count={3} className="h-5 w-6 text-ink-faint group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </Container>

      <JsonLd
        data={[
          articleLd({ title: guide.title, description: guide.description, path, published: guide.published, modified: guide.updated }),
          faqLd(guide.faqs),
        ]}
      />
    </article>
  );
}

function Cites({ ids, num }: { ids?: GuideSourceId[]; num: (id: GuideSourceId) => number }) {
  if (!ids?.length) return null;
  return (
    <sup className="ml-0.5 whitespace-nowrap">
      {ids.map((id, i) => (
        <a
          key={id}
          href={`#src-${id}`}
          aria-label={`Source ${num(id)}: ${GUIDE_SOURCES[id].cite}`}
          className="tabular px-0.5 text-[0.8rem] font-semibold text-accent no-underline hover:underline"
        >
          {num(id)}
          {i < ids.length - 1 ? ',' : ''}
        </a>
      ))}
    </sup>
  );
}

function BlockView({ block, num }: { block: Block; num: (id: GuideSourceId) => number }) {
  if ('p' in block)
    return (
      <p>
        {block.p}
        <Cites ids={block.cite} num={num} />
      </p>
    );
  if ('list' in block)
    return (
      <ul className="space-y-2 border-l-2 border-accent/40 pl-5">
        {block.list.map((li) => (
          <li key={li}>{li}</li>
        ))}
        {block.cite && (
          <li className="list-none text-xs text-ink-muted">
            Source <Cites ids={block.cite} num={num} />
          </li>
        )}
      </ul>
    );
  return (
    <aside className="border border-rule bg-paper-raised px-5 py-4 text-[0.95rem] leading-relaxed text-ink-soft">
      <span className="eyebrow mr-2 !text-accent">Note</span>
      {block.note}
      <Cites ids={block.cite} num={num} />
    </aside>
  );
}
