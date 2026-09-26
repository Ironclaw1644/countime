import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/layout/PageHero';
import { PullQuote } from '@/components/ui/PullQuote';
import { scripture } from '@/data/scripture';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { HandbookLibrary } from '@/components/handbooks/HandbookLibrary';
import { getAllFacilities } from '@/lib/facilities';

export const metadata = pageMetadata({
  title: 'Federal prison A&O handbooks — every BOP camp’s Admission & Orientation handbook',
  ogTitle: 'The official A&O handbook library',
  description:
    'The official Admission & Orientation (A&O) handbook for every federal prison camp, satellite camp and medical center that has one. Each link is checked against bop.gov.',
  path: '/handbooks',
});

export default function HandbooksPage() {
  // Only facilities BOP actually publishes a handbook for. Guessing the URL
  // pattern used to produce a library of 404s.
  const facilities = getAllFacilities().filter(
    (f) => f.handbookUrl && f.status !== 'CLOSED',
  );

  return (
    <>
      <PageHero
        eyebrow="Handbook library"
        title="Every handbook the Bureau publishes, gathered for the people who love them."
        crumbs={[{ name: 'Handbooks', path: '/handbooks' }]}
        lede={
          <p>
            Each Bureau of Prisons facility hands new arrivals an <em>Admission &amp; Orientation</em> handbook
            in their first week — the rules, the routines, the small things that turn into big things if you
            don&rsquo;t know about them. Every link here was checked against bop.gov; facilities the Bureau
            publishes no handbook for are left out rather than linked to a dead page.
          </p>
        }
      />

      <Section className="pt-2 pb-24 sm:pb-32">
        <Container>
          <HandbookLibrary facilities={facilities} />
        </Container>
      </Section>
      <section className="py-16 sm:py-20 print:hidden">
        <Container>
          <PullQuote verse={scripture('philippians-4-12-13')} />
        </Container>
      </section>
    </>
  );
}
