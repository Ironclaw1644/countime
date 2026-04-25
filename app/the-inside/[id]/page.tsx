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

        <p className="small-caps text-[11px] text-ink-muted">{term.category}</p>
        <h1 className="font-display mt-2 text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl">
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

        {term.purpose && (
          <aside className="mt-12 rounded-2xl border border-clay/30 bg-clay-soft/20 p-6 sm:p-8">
            <p className="small-caps text-[11px] text-clay-deep">Why it exists</p>
            <p className="mt-2 text-[16px] leading-relaxed text-ink">
              {term.purpose}
            </p>
          </aside>
        )}

        {term.sources && term.sources.length > 0 && (
          <section className="mt-12 border-t border-ink/10 pt-8">
            <h2 className="small-caps text-[11px] text-ink-muted">
              Further reading
            </h2>
            <ul className="mt-4 space-y-2">
              {term.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] text-ink-soft hover:text-clay-deep"
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
          <section className="mt-12 border-t border-ink/10 pt-8">
            <h2 className="small-caps text-[11px] text-ink-muted">
              Related terms
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/the-inside/${r.id}`}
                    className="inline-flex items-center rounded-full border border-ink/15 bg-cream-50/60 px-3 py-1 text-[12px] text-ink-soft hover:border-clay/40 hover:text-clay-deep"
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
