import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { InsideLibrary } from '@/components/inside/InsideLibrary';
import { getAllInsideTerms, getInsideTermCategories } from '@/lib/inside-terms';

export const metadata: Metadata = {
  title: 'The Inside',
  description:
    'A plain-English field guide to the quirks, jargon, and unwritten rules of doing federal time — written for the people on the outside who are trying to understand.',
};

export default function TheInsidePage() {
  const terms = getAllInsideTerms();
  const categories = getInsideTermCategories();

  return (
    <>
      <Section className="pt-12 pb-8 sm:pt-16">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-50/70 px-3 py-1 text-[11px] text-ink-muted shadow-paper">
              <Icon icon={faComments} className="text-clay" />
              <span className="small-caps">The Inside</span>
            </div>
            <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl md:text-7xl">
              The things you only learn once you&rsquo;re in.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-soft">
              Federal prison runs on a vocabulary and a set of habits that
              nobody hands you a glossary for. This is that glossary —
              definitions and the why behind them, written for the people on
              the outside who are trying to understand what their person is
              describing.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="pt-2 pb-24 sm:pb-32">
        <Container>
          <InsideLibrary terms={terms} categories={categories} />
        </Container>
      </Section>
    </>
  );
}
