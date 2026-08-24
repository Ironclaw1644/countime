import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { EmailCaptureForm } from '@/components/EmailCaptureForm';
import { ChecklistPrintToolbar } from '@/components/ChecklistPrintToolbar';
import { SURRENDER_CHECKLIST } from '@/data/surrender-checklist';
import { cn } from '@/lib/cn';
import {
  faArrowRight,
  faCircleCheck,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Self-Surrender Prep Checklist — Countime',
  description:
    'The 90/60/30/7/day-of checklist for federal self-surrender. Calm, sourced, and free. Built for white-collar defendants and their families.',
};

const TONE_BG: Record<string, string> = {
  sage: 'bg-accent/12 text-accent',
  gold: 'bg-tone-rdap/20 text-tone-rdap',
  teal: 'bg-tone-medical/15 text-tone-medical',
  clay: 'bg-accent/15 text-accent-hover',
  slate: 'bg-tone-holding/15 text-tone-holding',
};

export default function ChecklistPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-12 pb-6 sm:pt-20 sm:pb-8">
        <Container width="narrow">
          <p className="eyebrow text-[11px] text-accent-hover">
            Free — for families navigating self-surrender
          </p>
          <h1 className="font-display mt-4 text-balance text-3xl leading-[1.05] tracking-[-0.02em] text-ink ">
            The Self-Surrender Prep&nbsp;Checklist.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-soft">
            A 90-day map of what to do, in what order, before reporting to a
            federal facility. Written calmly. Sourced to the BOP where it
            matters. Free, because no family should face this alone.
          </p>

          <div className="mt-8 max-w-md">
            <EmailCaptureForm
              mode="subscribe"
              source="checklist"
              successPath="/checklist/thanks"
              placeholder="you@example.com"
              cta="Send me the checklist"
              disclaimer="One email. No spam. Unsubscribe anytime. We never sell your information."
              variant="card"
            />
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
            Or just read it on this page —{' '}
            <a href="#start" className="underline-offset-2 hover:underline">
              jump to the checklist
            </a>
            . Press <kbd className="rounded border border-ink/15 bg-paper px-1.5 py-0.5 text-[11px]">⌘P</kbd>{' '}
            (or <kbd className="rounded border border-ink/15 bg-paper px-1.5 py-0.5 text-[11px]">Ctrl+P</kbd>) to
            save as PDF.
          </p>
        </Container>
      </Section>

      {/* Print toolbar — visible in screen mode */}
      <Section className="py-2 print:hidden">
        <Container width="narrow">
          <ChecklistPrintToolbar
            version={SURRENDER_CHECKLIST.version}
            updatedAt={SURRENDER_CHECKLIST.updatedAt}
          />
        </Container>
      </Section>

      {/* Checklist body */}
      <Section id="start" className="pb-20 pt-8">
        <Container width="narrow">
          <div className="space-y-14">
            {SURRENDER_CHECKLIST.sections.map((section) => (
              <article key={section.window} className="break-inside-avoid">
                <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3">
                  <div>
                    <p
                      className={cn(
                        'eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px]',
                        TONE_BG[section.tone] ?? TONE_BG.sage,
                      )}
                    >
                      {section.window}
                    </p>
                    <h2 className="font-display mt-3 text-3xl leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
                      {section.tagline}
                    </h2>
                  </div>
                </header>

                <div className="mt-8 space-y-10">
                  {section.subsections.map((sub) => (
                    <div key={sub.title}>
                      <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">
                        {sub.title}
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {sub.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-start gap-3 rounded-xl bg-paper-raised/60 p-3 print:bg-transparent print:p-0"
                          >
                            <span
                              aria-hidden
                              className="mt-0.5 inline-grid h-5 w-5 shrink-0 place-items-center rounded border border-ink/30 text-transparent print:border-ink/60"
                            >
                              ✓
                            </span>
                            <div className="flex-1">
                              <p className="text-[15px] leading-relaxed text-ink">
                                {item.text}
                              </p>
                              {item.detail && (
                                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                                  {item.detail}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Sources */}
          <div className="mt-16 rounded border border-rule bg-paper-raised/60 p-6">
            <p className="eyebrow text-[10px] text-ink-muted">Sources</p>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-ink-soft">
              <li>
                <a
                  href="https://www.bop.gov/inmates/custody_and_care/voluntary_surrenders.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  BOP — Voluntary Surrenders
                </a>
              </li>
              <li>
                <a
                  href="https://www.bop.gov/resources/pdfs/legal_guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  BOP Legal Resource Guide (PDF)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bop.gov/policy/progstat/5100_008cn.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  BOP Program Statement 5100.08 — Designation
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-muted">
              This checklist is informational. It is not legal advice. Your
              attorney is the source of truth for your case. Verify any
              facility-specific rule against the facility&apos;s A&amp;O
              handbook before relying on it.
            </p>
          </div>

          {/* Upsell to paid program */}
          <div className="mt-12 overflow-hidden rounded-lg border border-rule bg-gradient-to-br from-paper-sunk via-paper-raised to-paper p-8 shadow-raise print:hidden sm:p-10">
            <p className="eyebrow text-[10px] text-accent-hover">
              Want more than a list?
            </p>
            <h3 className="font-display mt-3 text-3xl leading-tight tracking-[-0.02em] text-ink">
              The Countime <em>Surrender Prep Companion</em>.
            </h3>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              A guided 90-day program: progress-tracked checklist, 12 deep-dive
              guides, templates (POA, kids&apos; explanation, employer letter,
              intake medical packet), a calmly-paced 45-email sequence, and
              live group Q&amp;As with a vetted advisor. Founding-member
              pricing.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/prep-program"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-accent-on hover:bg-accent-hover"
              >
                <Icon icon={faRightToBracket} />
                See the program
                <Icon icon={faArrowRight} className="text-[11px]" />
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
                <Icon icon={faCircleCheck} className="text-accent" />
                30-day refund — no questions asked
              </span>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
