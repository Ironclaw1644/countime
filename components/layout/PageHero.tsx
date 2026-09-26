import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

/**
 * The night-band page opener shared by the inner pages: breadcrumbs, an
 * eyebrow, a serif headline with an optional italic tail in sodium, and a lede.
 */
export function PageHero({
  eyebrow,
  title,
  italic,
  lede,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  lede?: React.ReactNode;
  crumbs: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="band-night overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14">
      <Container width="wide">
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, ...crumbs]} className="print:hidden" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow className="!text-accent">{eyebrow}</Eyebrow>
            <h1 className="mt-4 text-4xl text-ink lg:text-[4.25rem]">
              {title}
              {italic && (
                <>
                  {' '}
                  <em className="serif-italic text-accent">{italic}</em>
                </>
              )}
            </h1>
          </div>
          {lede && <div className="max-w-prose text-lg leading-relaxed text-ink-soft">{lede}</div>}
        </div>
        {children}
      </Container>
    </section>
  );
}
