import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import {
  faCircleCheck,
  faEnvelope,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Thank you — Countime',
  description: 'Thanks for joining the Countime Surrender Prep Companion.',
};

interface SearchParams {
  searchParams: Promise<{ mode?: string; session_id?: string }>;
}

export default async function PrepProgramThanksPage({
  searchParams,
}: SearchParams) {
  const params = await searchParams;
  const isWaitlist = params.mode === 'waitlist';

  return (
    <Section className="py-20">
      <Container width="narrow">
        <div className="rounded-lg border border-rule bg-paper-raised/80 p-10 text-center shadow-raise sm:p-14">
          <Icon icon={faCircleCheck} className="text-[40px] text-accent" />
          <h1 className="font-display mt-5 text-balance text-4xl leading-tight tracking-[-0.02em] text-ink ">
            {isWaitlist ? 'You’re on the list.' : 'Welcome in.'}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
            {isWaitlist ? (
              <>
                We&rsquo;re onboarding founding members in small cohorts so we
                can keep the live Q&amp;As genuinely useful. You&rsquo;ll get
                one email the moment the next cohort opens — no marketing
                blast, no urgency tricks, just a quiet note.
              </>
            ) : (
              <>
                Your Surrender Prep Companion is being set up. You&rsquo;ll get
                a confirmation email shortly with your access link and the
                schedule for the next live Q&amp;A. In the meantime, the free
                checklist is the right place to start.
              </>
            )}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/checklist#start" size="lg">
              Read the checklist
              <Icon icon={faArrowRight} className="text-[11px]" />
            </ButtonLink>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-3 text-[14px] text-ink-soft hover:bg-paper-sunk hover:text-ink"
            >
              <Icon icon={faEnvelope} />
              Email a person
            </Link>
          </div>

          {!isWaitlist && (
            <p className="mt-10 text-[12px] leading-relaxed text-ink-muted">
              Your payment is processed by Stripe. You&rsquo;ll see
              &ldquo;Countime&rdquo; on your statement. 30-day refund — no
              questions asked. Just reply to the confirmation email.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
