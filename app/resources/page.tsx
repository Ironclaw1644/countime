import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import {
  faBook,
  faMap,
  faCircleQuestion,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'A short, plain-English glossary and links for families preparing for federal prison camp.',
};

const FAQS = [
  {
    q: 'What is a Federal Prison Camp (FPC)?',
    a: 'A minimum-security federal facility for inmates with the lowest level of risk and the lowest level of security needs. Most have no fence; many house people convicted of non-violent, white-collar offenses.',
  },
  {
    q: 'What is the 500-mile rule?',
    a: 'The Bureau of Prisons aims to designate inmates within 500 miles of their release residence when possible. It is a guideline, not a guarantee — bed space, security level, and program needs all factor in.',
  },
  {
    q: 'What is RDAP?',
    a: 'The Residential Drug Abuse Program is a 9-12 month treatment program. Successful completion can reduce a sentence by up to one year and offer additional time in a halfway house. Eligibility is determined by the BOP, not by the sentencing court.',
  },
  {
    q: 'What is an A&O handbook?',
    a: 'The Admission & Orientation handbook is given to every inmate in their first week at a facility. It explains rules, routines, mail, visiting, the commissary, and how to request things. Reading the handbook for the receiving facility before arrival is one of the most useful things a family can do.',
  },
  {
    q: 'What is a "self-surrender"?',
    a: 'When the court allows it, the inmate reports themselves to the designated facility on the date specified in the Judgment & Commitment order rather than being taken into custody at sentencing. Most white-collar inmates self-surrender.',
  },
  {
    q: 'How do I find someone in BOP custody?',
    a: 'The BOP’s Inmate Locator at bop.gov/inmateloc returns the assigned facility and projected release date. There is sometimes a delay between sentencing and the designation appearing.',
  },
];

const LINKS = [
  {
    title: 'Bureau of Prisons — Facility List',
    href: 'https://www.bop.gov/locations/list.jsp',
    note: 'Official directory of every BOP facility.',
  },
  {
    title: 'BOP Inmate Locator',
    href: 'https://www.bop.gov/inmateloc/',
    note: 'Find the facility and projected release date for a federal inmate.',
  },
  {
    title: 'BOP RDAP overview',
    href: 'https://www.bop.gov/inmates/custody_and_care/substance_abuse_treatment.jsp',
    note: 'Official program description and eligibility.',
  },
  {
    title: 'Probation & Pretrial Services',
    href: 'https://www.uscourts.gov/services-forms/probation-and-pretrial-services',
    note: 'Federal probation, pretrial release, and supervised release.',
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Section className="pt-12 pb-10 sm:pt-20">
        <Container width="narrow">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-50/70 px-3 py-1 text-[11px] text-ink-muted shadow-paper">
            <Icon icon={faCircleQuestion} className="text-clay" />
            <span className="small-caps">Resources</span>
          </div>
          <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl">
            Plain answers to the questions most families ask first.
          </h1>
          <p className="mt-6 text-pretty text-[17px] leading-relaxed text-ink-soft">
            A short glossary of the terms that show up over and over in this
            process — and links to the official sources behind them.
          </p>
        </Container>
      </Section>

      <Section className="py-10">
        <Container width="narrow">
          <h2 className="font-display rule-under text-3xl leading-tight tracking-tightest text-ink sm:text-4xl">
            Common questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-ink/10 bg-cream-50/70 p-5 shadow-paper transition-colors open:bg-cream-50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                  <span className="text-[16px] leading-snug">{item.q}</span>
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/15 text-ink-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-10">
        <Container width="narrow">
          <h2 className="font-display rule-under text-3xl leading-tight tracking-tightest text-ink sm:text-4xl">
            Official links
          </h2>
          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-6 py-5 transition-colors hover:bg-cream-100/40"
                >
                  <div>
                    <p className="font-display text-xl leading-tight tracking-tightest text-ink group-hover:text-clay-deep">
                      {link.title}
                    </p>
                    <p className="mt-1 text-[14px] text-ink-soft">{link.note}</p>
                  </div>
                  <Icon
                    icon={faArrowUpRightFromSquare}
                    className="text-ink-muted group-hover:text-clay-deep"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="pb-24">
        <Container width="narrow">
          <div className="grid gap-3 sm:grid-cols-2">
            <ButtonLink href="/" size="md" variant="outline" className="justify-center">
              <Icon icon={faMap} />
              Camp map
            </ButtonLink>
            <ButtonLink href="/handbooks" size="md" variant="outline" className="justify-center">
              <Icon icon={faBook} />
              Handbook library
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
