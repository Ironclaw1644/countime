import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import {
  faArrowRight,
  faCircleCheck,
  faPrint,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Your checklist is ready — Countime',
  description: 'Thanks for joining the Countime list. Your self-surrender prep checklist is ready.',
};

export default function ChecklistThanksPage() {
  return (
    <Section className="py-20">
      <Container width="narrow">
        <div className="rounded-lg border border-rule bg-paper-raised/80 p-10 text-center shadow-raise sm:p-14">
          <Icon icon={faCircleCheck} className="text-[40px] text-accent" />
          <h1 className="font-display mt-5 text-balance text-4xl leading-tight tracking-[-0.02em] text-ink ">
            You&rsquo;re on the list.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
            The full checklist is ready below. Save it to your phone, print it,
            put a copy on the kitchen counter. We&rsquo;ll email you the next
            time we add a section.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/checklist#start" size="lg">
              <Icon icon={faBook} />
              Read the checklist
            </ButtonLink>
            <Link
              href="/checklist#start"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-3 text-[14px] text-ink-soft hover:bg-paper-sunk hover:text-ink"
            >
              <Icon icon={faPrint} />
              Or press ⌘P to save as PDF
            </Link>
          </div>

          <div className="mt-12 rounded border border-rule bg-paper p-6 text-left">
            <p className="eyebrow text-[10px] text-accent-hover">
              While you&rsquo;re here
            </p>
            <h2 className="font-display mt-2 text-2xl leading-tight tracking-[-0.02em] text-ink">
              The Surrender Prep Companion
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
              The companion to this checklist: progress-tracked digital
              checklist, 12 deep-dive guides, templates, a 45-email sequence
              calmly timed across 90 days, and live group Q&amp;As with a
              vetted advisor. Founding-member pricing, 30-day refund.
            </p>
            <div className="mt-5">
              <Link
                href="/prep-program"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-accent-on hover:bg-accent-hover"
              >
                See what&rsquo;s included
                <Icon icon={faArrowRight} className="text-[11px]" />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-[12px] leading-relaxed text-ink-muted">
            Need anything? Email{' '}
            <a
              href="/contact"
              className="underline-offset-2 hover:text-accent-hover hover:underline"
            >
              the contact form
            </a>
            . A person reads every message.
          </p>
        </div>
      </Container>
    </Section>
  );
}
