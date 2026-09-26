import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { PullQuote } from '@/components/ui/PullQuote';
import { scripture } from '@/data/scripture';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { InsideLibrary } from '@/components/inside/InsideLibrary';
import { getAllInsideTerms, getInsideTermCategories } from '@/lib/inside-terms';

export const metadata = pageMetadata({
  title: 'The Inside — a plain-English glossary of federal prison life',
  ogTitle: 'The Inside: the words nobody explains beforehand',
  description:
    'A plain-English field guide to the quirks, jargon and unwritten rules of doing federal time — counts, recall, shots, commissary, R&D — for the people on the outside trying to understand.',
  path: '/the-inside',
});

export default function TheInsidePage() {
  const terms = getAllInsideTerms();
  const categories = getInsideTermCategories();

  return (
    <>
      <PageHero
        eyebrow="The Inside"
        title="The things you only learn"
        italic="once you’re in."
        crumbs={[{ name: 'The Inside', path: '/the-inside' }]}
        lede={
          <p>
            Federal prison runs on a vocabulary nobody hands you a glossary for. This is that glossary —
            definitions and the why behind them, for the people on the outside trying to understand what their
            person is describing.
          </p>
        }
      />

      <Section className="pt-2 pb-24 sm:pb-32">
        <Container>
          <InsideLibrary terms={terms} categories={categories} />
        </Container>
      </Section>
      <section className="py-16 sm:py-20 print:hidden">
        <Container>
          <PullQuote verse={scripture('ecclesiastes-4-9-10')} />
        </Container>
      </section>
    </>
  );
}
