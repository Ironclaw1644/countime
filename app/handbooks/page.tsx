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
  const facilities = getAllFacilities();

  return (
    <>
      <Section className="pt-12 pb-8 sm:pt-16">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-50/70 px-3 py-1 text-[11px] text-ink-muted shadow-paper">
              <Icon icon={faBook} className="text-clay" />
              <span className="small-caps">Handbook library</span>
            </div>
            <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl md:text-7xl">
              The handbook for every camp, gathered for the people who love them.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-soft">
              Each Bureau of Prisons facility hands new arrivals an{' '}
              <em>Admission &amp; Orientation</em> handbook in their first
              week — the rules, the routines, the small things that turn into
              big things if you don&rsquo;t know about them. We&rsquo;ve
              collected them so families can read along.
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
