import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { faArrowRight, faHandshake } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Countime is a quiet companion for white-collar offenders and the people who love them, built to demystify federal prison camps.',
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-12 pb-12 sm:pt-20">
        <Container width="narrow">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-50/70 px-3 py-1 text-[11px] text-ink-muted shadow-paper">
            <Icon icon={faHandshake} className="text-clay" />
            <span className="small-caps">About Countime</span>
          </div>
          <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl">
            Built for the families who didn&rsquo;t expect to need it.
          </h1>
          <p className="mt-7 text-pretty text-[18px] leading-relaxed text-ink-soft">
            A federal sentencing letter changes a household. The first week
            after, the questions multiply faster than the answers. Countime is
            our small attempt to fix that — a quiet companion that puts the
            map, the handbooks, and the language all in one place.
          </p>
        </Container>
      </Section>

      <Section className="py-12">
        <Container width="narrow">
          <article className="prose-editorial space-y-7 text-[17px] leading-[1.75] text-ink-soft">
            <Heading>Who we serve</Heading>
            <p>
              Countime is built first for white-collar offenders and their
              families — people who are likely facing a federal prison camp,
              not a high-security facility — and the loved ones who will be
              driving to visit, mailing books, and waiting through phone-call
              minutes. Most of what&rsquo;s here is useful to anyone navigating
              minimum-custody federal incarceration.
              {/* TODO: confirm exact audience scope with founder */}
            </p>

            <Heading>What we believe</Heading>
            <p>
              The system is hard enough without an interface that adds to it.
              Information should arrive in plain English, in a calm voice, with
              the citations to back it up. We&rsquo;d rather be quiet and
              correct than loud and approximate.
            </p>

            <Heading>What we&rsquo;re not</Heading>
            <p>
              Countime is not a law firm and we don&rsquo;t give legal advice.
              We don&rsquo;t advocate for or against any individual case. If
              you&rsquo;re still in pre-sentencing, please work with your
              attorney before relying on anything you find here.
            </p>

            <Heading>How this site stays current</Heading>
            <p>
              Our data is sourced from the Federal Bureau of Prisons&rsquo;
              public facility pages. We re-verify handbook links and contact
              information periodically and welcome corrections from people
              closer to a facility than we are. If something here is wrong or
              out of date, please write us at{' '}
              <a
                href="mailto:hello@countime.com"
                className="text-clay-deep underline-offset-2 hover:underline"
              >
                hello@countime.com
              </a>
              .
            </p>
          </article>
        </Container>
      </Section>

      <Section className="pb-24">
        <Container width="narrow">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-cream-50/70 p-6 shadow-paper">
            <p className="text-[15px] text-ink-soft">
              Looking for a specific camp?
            </p>
            <ButtonLink href="/" size="md">
              Open the camp map
              <Icon icon={faArrowRight} />
            </ButtonLink>
          </div>
          <p className="mt-6 text-center text-[12px] text-ink-muted">
            Have something to share?{' '}
            <Link href="/contact" className="underline-offset-2 hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display rule-under text-[28px] leading-tight tracking-tightest text-ink">
      {children}
    </h2>
  );
}
