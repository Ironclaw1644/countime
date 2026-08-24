import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { PullQuote } from '@/components/ui/PullQuote';
import { EmailCaptureForm } from '@/components/EmailCaptureForm';
import { isStripeConfigured } from '@/lib/stripe';
import {
  faArrowRight,
  faCircleCheck,
  faBook,
  faRightToBracket,
  faEnvelope,
  faFilePen,
  faUsers,
  faPersonWalkingArrowRight,
  faStethoscope,
  faSackDollar,
  faPeopleRoof,
  faShieldHeart,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'The Surrender Prep Companion — Countime',
  description:
    'A guided 90-day program for federal self-surrender. Progress-tracked checklist, 12 deep-dive guides, templates, a 45-email sequence, and live Q&As with a vetted advisor.',
};

const INCLUDES = [
  {
    icon: faBook,
    title: 'The 90-day progress-tracked checklist',
    body: 'The full Countime checklist as a working tool — check items off, track what your spouse is handling, see what&rsquo;s left.',
  },
  {
    icon: faFilePen,
    title: '12 deep-dive guides',
    body: 'Long-form, calmly-written guides on the topics families actually struggle with: telling the kids, the medical-intake conversation, the financial handoff, what to expect in R&D, the first phone call, the first visit.',
  },
  {
    icon: faEnvelope,
    title: 'A 45-email sequence, calmly timed across 90 days',
    body: 'One message at each meaningful moment — never urgent, never alarmist. Each email is a small nudge with one task.',
  },
  {
    icon: faPersonWalkingArrowRight,
    title: 'Templates you can actually use',
    body: 'Durable power of attorney letter. Employer notification letter. Age-appropriate conversation script for kids. Intake medical packet. Visitor list cover letter.',
  },
  {
    icon: faUsers,
    title: 'Three live group Q&A sessions',
    body: 'Small group video calls with a vetted advisor — someone who has actually walked this road. 90 minutes each. Bring questions. Get real answers.',
  },
  {
    icon: faShieldHeart,
    title: 'Lifetime access for founding members',
    body: 'Everything we add for the next five years. No upsells, no extra tier. One price, one product.',
  },
];

const FOR_YOU_IF = [
  'You (or someone you love) has been ordered to self-surrender to a federal Bureau of Prisons facility.',
  'The case involves a non-violent offense and minimum-custody designation is likely (federal camps, FCI satellite camps, or FMCs).',
  'You want a calm, sourced, BOP-cited prep process — not fear-marketing from a $25k consultant.',
];

const NOT_FOR_YOU_IF = [
  'The case is not yet sentenced. Your attorney is the first call, not us.',
  'The designation is medium- or high-security. Different rules apply; please consult a federal defense attorney first.',
  'You&rsquo;re looking for legal representation. Countime is not a law firm and does not give legal advice.',
];

export default function PrepProgramPage() {
  const stripeReady = isStripeConfigured();

  return (
    <>
      {/* Hero */}
      <Section className="pt-12 pb-10 sm:pt-20 sm:pb-12">
        <Container width="default">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
            <div>
              <p className="eyebrow text-[11px] text-accent-hover">
                Founding-member release
              </p>
              <h1 className="font-display mt-4 text-balance text-3xl leading-[1.02] tracking-[-0.02em] text-ink">
                The Surrender Prep&nbsp;Companion.
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-soft sm:text-lg">
                A guided 90-day program for white-collar defendants and their
                families preparing for federal self-surrender. Calm voice.
                Real templates. The same checklist we publish for free —
                inside a tool that walks you through it.
              </p>

              <ul className="mt-8 space-y-2.5 text-[15px] text-ink-soft">
                <Bullet>The 90-day progress-tracked checklist</Bullet>
                <Bullet>12 deep-dive guides + 8 ready-to-use templates</Bullet>
                <Bullet>A calmly-paced 45-email sequence over 90 days</Bullet>
                <Bullet>3 live group Q&amp;A sessions with a vetted advisor</Bullet>
                <Bullet>Lifetime access — every future addition included</Bullet>
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {stripeReady ? (
                  <a
                    href="#buy"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-accent-on hover:bg-accent-hover"
                  >
                    <Icon icon={faRightToBracket} />
                    Join as a founding member — $299
                    <Icon icon={faArrowRight} className="text-[11px]" />
                  </a>
                ) : (
                  <a
                    href="#buy"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-accent-on hover:bg-accent-hover"
                  >
                    <Icon icon={faRightToBracket} />
                    Join the founding-member waitlist
                    <Icon icon={faArrowRight} className="text-[11px]" />
                  </a>
                )}
                <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
                  <Icon icon={faCircleCheck} className="text-accent" />
                  30-day refund — no questions
                </span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">
                Standard price will be $499 once founding cohort closes.
              </p>
            </div>

            <aside className="rounded-lg border border-rule bg-paper-raised/80 p-7 shadow-raise">
              <p className="eyebrow text-[10px] text-ink-muted">
                What you&rsquo;re paying for
              </p>
              <dl className="mt-4 space-y-3 text-[14px]">
                <Stat icon={faClock} value="90 days" label="of structured prep" />
                <Stat icon={faFilePen} value="12 + 8" label="deep-dive guides + templates" />
                <Stat icon={faEnvelope} value="45" label="calmly-timed emails" />
                <Stat icon={faUsers} value="3 live" label="group Q&As with an advisor" />
                <Stat icon={faShieldHeart} value="Lifetime" label="access for founding members" />
              </dl>
              <p className="mt-5 text-[12px] leading-relaxed text-ink-muted">
                Founding-member pricing closes when we hit 100 members.
                Standard price thereafter is $499.
              </p>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Pull quote */}
      <Section className="py-10">
        <Container width="narrow">
          <PullQuote attribution="The Countime promise">
            It&rsquo;s going to be okay. There is a way through this, and a lot
            of people who&rsquo;ve walked it before you.
          </PullQuote>
        </Container>
      </Section>

      {/* What's included */}
      <Section className="py-16">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow text-[11px] text-accent-hover">
              Inside the Companion
            </p>
            <h2 className="font-display rule-under mt-3 text-4xl leading-tight tracking-[-0.02em] text-ink ">
              What you actually get.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              No fluff, no fear-marketing, no upsells. One product. One price.
              Everything we&rsquo;ve learned about preparing calmly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {INCLUDES.map((item) => (
              <Includes key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Topics covered */}
      <Section className="py-16">
        <Container width="narrow">
          <p className="eyebrow text-[11px] text-accent-hover">
            The 12 deep-dive guides
          </p>
          <h2 className="font-display mt-3 text-4xl leading-tight tracking-[-0.02em] text-ink">
            What we walk through together.
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Guide
              icon={faPeopleRoof}
              title="Telling the kids"
              body="Age-appropriate, honest, brief. A script for each age range. What to promise and what not to."
            />
            <Guide
              icon={faSackDollar}
              title="The financial handoff"
              body="Inventory, auto-pay, commissary fund, income gap planning. Built around a real spreadsheet template."
            />
            <Guide
              icon={faPersonWalkingArrowRight}
              title="The walk-in"
              body="What to pack, what to leave home, what intake actually feels like, when your first call home is."
            />
            <Guide
              icon={faStethoscope}
              title="The medical-intake conversation"
              body="What BOP will ask, how to document chronic conditions, what to bring, the prescription bridge."
            />
            <Guide
              icon={faShieldHeart}
              title="The first 30 days inside"
              body="R&D, dorm assignment, programs orientation, recall, counts. What to do, what not to do."
            />
            <Guide
              icon={faUsers}
              title="The family on the outside"
              body="Building your support team, finding a therapist, what to tell schools and employers, the long arc."
            />
            <Guide
              icon={faBook}
              title="Reading the A&O handbook"
              body="How to actually use the handbook — what to memorize, what to skim, what to ignore."
            />
            <Guide
              icon={faEnvelope}
              title="Mail, calls, email (TRULINCS)"
              body="How communication actually works inside. Setting up CorrLinks. Who to add to the list."
            />
            <Guide
              icon={faPersonWalkingArrowRight}
              title="The first visit"
              body="Approved-visitor process, what to bring, what to expect, how to make it count."
            />
            <Guide
              icon={faShieldHeart}
              title="RDAP and programs"
              body="Eligibility, the application process, what the program is actually like, the time-credit math."
            />
            <Guide
              icon={faClock}
              title="Release-date math"
              body="Good time, First Step Act credits, halfway house eligibility — how to read your sentence."
            />
            <Guide
              icon={faPeopleRoof}
              title="Reentry — the back half"
              body="Halfway house, supervised release, employment after a conviction. The 18 months after release."
            />
          </div>
        </Container>
      </Section>

      {/* Who it's for */}
      <Section className="py-16">
        <Container width="narrow">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow text-[11px] text-accent">
                This is for you if
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                {FOR_YOU_IF.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon icon={faCircleCheck} className="mt-1 text-accent" />
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-[11px] text-accent-hover">
                This is not for you if
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                {NOT_FOR_YOU_IF.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 text-accent-hover">·</span>
                    <span dangerouslySetInnerHTML={{ __html: line }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buy section */}
      <Section id="buy" className="py-16">
        <Container width="narrow">
          <div className="overflow-hidden rounded-lg border border-rule bg-gradient-to-br from-paper-sunk via-paper-raised to-paper p-10 shadow-raise sm:p-14">
            <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <p className="eyebrow text-[11px] text-accent-hover">
                  {stripeReady ? 'Join as a founding member' : 'Join the waitlist'}
                </p>
                <h2 className="font-display mt-3 text-balance text-4xl leading-tight tracking-[-0.02em] text-ink ">
                  {stripeReady
                    ? 'One price. Lifetime access. $299.'
                    : 'Be first in line.'}
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
                  {stripeReady
                    ? 'Founding-member pricing closes at 100 members. After that the program is $499 standard. Refund within 30 days, no questions.'
                    : 'We&rsquo;re onboarding founding members in cohorts. Drop your email and we&rsquo;ll let you know the moment the next one opens.'}
                </p>
                <ul className="mt-6 space-y-2 text-[14px] text-ink-soft">
                  <Bullet>30-day refund — no questions asked</Bullet>
                  <Bullet>One-time payment, no subscription</Bullet>
                  <Bullet>Email a person, not a ticket queue</Bullet>
                </ul>
              </div>

              <div className="rounded border border-rule bg-paper-raised/70 p-6">
                {stripeReady ? (
                  <>
                    <p className="eyebrow text-[10px] text-ink-muted">
                      Founding member · $299
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                      Enter your email below to check out securely with Stripe.
                    </p>
                    <div className="mt-5">
                      <EmailCaptureForm
                        mode="checkout"
                        source="prep_program_purchase"
                        cta="Continue to checkout"
                        disclaimer="You'll be redirected to Stripe to complete your purchase. By continuing, you agree to receive program emails. Unsubscribe anytime."
                        variant="default"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-[10px] text-ink-muted">
                      Founding-member waitlist
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                      We&rsquo;ll let you know the moment doors open.
                    </p>
                    <div className="mt-5">
                      <EmailCaptureForm
                        mode="subscribe"
                        source="prep_program_waitlist"
                        successPath="/prep-program/thanks?mode=waitlist"
                        cta="Add me to the waitlist"
                        disclaimer="No spam. One email when the next cohort opens. Unsubscribe anytime."
                        variant="default"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="mt-8 text-[12px] leading-relaxed text-ink-muted">
              Questions? Email{' '}
              <a
                href="/contact"
                className="underline-offset-2 hover:text-accent-hover hover:underline"
              >
                the contact form
              </a>
              . Countime is not a law firm and does not provide legal advice.
            </p>
          </div>
        </Container>
      </Section>

      {/* Quiet outro */}
      <Section className="py-12">
        <Container width="narrow">
          <p className="text-center text-[14px] leading-relaxed text-ink-muted">
            Still not sure? Read{' '}
            <Link href="/checklist" className="underline-offset-2 hover:text-accent-hover hover:underline">
              the free checklist
            </Link>{' '}
            first. The Companion is what we hand you when the list isn&rsquo;t
            enough on its own.
          </p>
        </Container>
      </Section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Icon icon={faCircleCheck} className="mt-1 text-accent" />
      <span>{children}</span>
    </li>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-rule pb-2.5 last:border-b-0 last:pb-0">
      <span className="inline-flex items-center gap-2 text-ink-soft">
        <Icon icon={icon} className="text-accent" />
        {label}
      </span>
      <span className="font-display text-xl leading-none tracking-[-0.02em] text-ink">
        {value}
      </span>
    </div>
  );
}

function Includes({
  icon,
  title,
  body,
}: {
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  title: string;
  body: string;
}) {
  return (
    <article>
      <div className="mb-3 grid h-11 w-11 place-items-center rounded bg-accent/12 text-accent-hover">
        <Icon icon={icon} className="text-base" />
      </div>
      <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">
        {title}
      </h3>
      <p
        className="mt-2 text-[15px] leading-relaxed text-ink-soft"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}

function Guide({
  icon,
  title,
  body,
}: {
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded border border-rule bg-paper-raised/60 p-5">
      <div className="flex items-center gap-3">
        <Icon icon={icon} className="text-accent" />
        <h3 className="font-display text-lg leading-tight tracking-[-0.02em] text-ink">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
