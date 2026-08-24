import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { HandbookLibrary } from '@/components/handbooks/HandbookLibrary';
import { Icon } from '@/components/ui/Icon';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { getAllFacilities } from '@/lib/facilities';

export const metadata: Metadata = {
  title: 'Handbook library',
  description:
    'Download the official Admission & Orientation handbook for every Federal Prison Camp, Federal Medical Center, and satellite camp in one place.',
};

export default function HandbooksPage() {
  // Only facilities BOP actually publishes a handbook for. Guessing the URL
  // pattern used to produce a library of 404s.
  const facilities = getAllFacilities().filter(
    (f) => f.handbookUrl && f.status !== 'CLOSED',
  );

  return (
    <>
      <Section className="pt-12 pb-8 sm:pt-16">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rule bg-paper-raised/70 px-3 py-1 text-[11px] text-ink-muted shadow-raise">
              <Icon icon={faBook} className="text-accent" />
              <span className="eyebrow">Handbook library</span>
            </div>
            <h1 className="font-display text-balance text-3xl leading-[1.05] tracking-[-0.02em] text-ink  md:text-7xl">
              Every handbook the Bureau publishes, gathered for the people who love them.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-soft">
              Each Bureau of Prisons facility hands new arrivals an <em>Admission &amp;
              Orientation</em> handbook in their first week — the rules, the routines,
              the small things that turn into big things if you don&rsquo;t know about
              them. Every link here was checked against bop.gov; facilities the Bureau
              publishes no handbook for are left out rather than linked to a dead page.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="pt-2 pb-24 sm:pb-32">
        <Container>
          <HandbookLibrary facilities={facilities} />
        </Container>
      </Section>
    </>
  );
}
