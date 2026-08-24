import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  getAllInsideTerms,
  getInsideTermById,
} from '@/lib/inside-terms';

export async function generateStaticParams() {
  return getAllInsideTerms().map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = getInsideTermById(id);
  if (!t) return { title: 'Term not found' };
  return {
    title: `${t.title} — The Inside`,
    description: t.shortDefinition,
  };
}

export default async function InsideTermPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const term = getInsideTermById(id);
  if (!term) notFound();

  const related = (term.related ?? [])
    .map((rid) => getInsideTermById(rid))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Section className="pt-10 pb-24 sm:pt-14 sm:pb-32">
      <Container width="narrow">
        <div className="mb-6">
          <Link
            href="/the-inside"
            className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted transition-colors hover:text-ink"
          >
            <Icon icon={faArrowLeft} className="text-[10px]" />
            Back to The Inside
          </Link>
        </div>

        <p className="eyebrow text-[11px] text-ink-muted">{term.category}</p>
        <h1 className="font-display mt-2 text-balance text-3xl leading-[1.05] tracking-[-0.02em] text-ink ">
          {term.title}
        </h1>
        <p className="mt-5 max-w-prose text-pretty text-[18px] leading-relaxed text-ink-soft">
          {term.shortDefinition}
        </p>

        <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-ink">
          {term.body.map((para, i) => (
            <p key={i} className="text-pretty">
              {para}
            </p>
          ))}
        </div>

        {term.testimony && term.testimony.length > 0 && (
          <section className="mt-12">
            <h2 className="eyebrow text-[11px] text-accent">
              In their words
            </h2>
            <div className="mt-4 space-y-4">
              {term.testimony.map((t, i) => (
                <figure
                  key={i}
                  className="rounded border border-accent/30 bg-accent/10 p-6 sm:p-7"
                >
                  <blockquote className="font-display text-pretty text-[18px] leading-[1.55] text-ink sm:text-[19px]">
                    <span aria-hidden="true" className="mr-1 text-accent/70">
                      &ldquo;
                    </span>
                    {t.quote}
                    <span aria-hidden="true" className="ml-1 text-accent/70">
                      &rdquo;
                    </span>
                  </blockquote>
                  <figcaption className="mt-4 text-[13px] text-ink-soft">
                    <span>&mdash; {t.attribution}</span>
                    {(t.sourceLabel || t.sourceUrl) && (
                      <span className="text-ink-muted">
                        {t.sourceUrl ? (
                          <>
                            ,{' '}
                            <a
                              href={t.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline-offset-2 hover:text-accent hover:underline"
                            >
                              {t.sourceLabel ?? 'source'}
                            </a>
                          </>
                        ) : (
                          <>, {t.sourceLabel}</>
                        )}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {term.purpose && (
          <aside className="mt-12 rounded border border-accent/30 bg-accent/20 p-6 sm:p-8">
            <p className="eyebrow text-[11px] text-accent-hover">Why it exists</p>
            <p className="mt-2 text-[16px] leading-relaxed text-ink">
              {term.purpose}
            </p>
          </aside>
        )}

        {term.coping && term.coping.length > 0 && (
          <section className="mt-12 border-t border-rule pt-8">
            <h2 className="eyebrow text-[11px] text-ink-muted">
              Ways through it
            </h2>
            <ol className="mt-5 space-y-5">
              {term.coping.map((c, i) => (
                <li key={i} className="grid gap-1">
                  <p className="font-display text-[18px] leading-snug text-ink">
                    {c.strategy}
                  </p>
                  <p className="text-pretty text-[16px] leading-relaxed text-ink-soft">
                    {c.detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {term.sources && term.sources.length > 0 && (
          <section className="mt-12 border-t border-rule pt-8">
            <h2 className="eyebrow text-[11px] text-ink-muted">
              Further reading
            </h2>
            <ul className="mt-4 space-y-2">
              {term.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-ink-soft hover:text-accent-hover"
                  >
                    {s.label}
                    <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12 border-t border-rule pt-8">
            <h2 className="eyebrow text-[11px] text-ink-muted">
              Related terms
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/the-inside/${r.id}`}
                    className="inline-flex items-center rounded-full border border-ink/15 bg-paper-raised/60 px-3 py-1 text-[12px] text-ink-soft hover:border-accent/40 hover:text-accent-hover"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </Section>
  );
}
