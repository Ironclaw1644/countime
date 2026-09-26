import { Suspense } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FaqList } from '@/components/seo/FaqList';
import { Calculator } from '@/components/calculator/Calculator';
import { SOURCES, type SourceId } from '@/lib/fsa/rules';
import { INELIGIBLE_OFFENSES } from '@/lib/fsa/exclusions';
import { scripture } from '@/data/scripture';
import { JsonLd, calculatorLd, faqLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'First Step Act calculator — federal release date with FSA time credits & good time',
  ogTitle: 'When could they come home? The First Step Act calculator',
  description:
    'Free First Step Act release date calculator: good conduct time, FSA time credits, RDAP and halfway house / home confinement dates on one timeline. Checked against the Bureau of Prisons’ own worked examples, every rule cited.',
  path: '/calculator',
});

const VERSE = scripture('proverbs-16-9');

const METHOD: { step: string; body: string; cite: SourceId[] }[] = [
  {
    step: 'Start and full term',
    body: 'The sentence commences the day it begins to be served — self-surrender, or being received in custody awaiting transport. We count that day as day one, so 12 months from January 1 ends December 31. Jail credit comes off day for day.',
    cite: ['usc-3585'],
  },
  {
    step: 'Good conduct time',
    body: 'Up to 54 days for each year of the sentence imposed (not time served), only for sentences of more than a year. BOP projects the maximum from day one, prorates a partial final year by its days and rounds down. 42 days a year without a diploma or GED in progress.',
    cite: ['usc-3624b', 'cfr-523-20'],
  },
  {
    step: 'RDAP',
    body: 'Completing the drug program can take up to a year off for a nonviolent offense; BOP caps it at 6 months for sentences of 30 months or less and 9 months for 31–36. BOP takes RDAP off before applying time credits.',
    cite: ['usc-3621e', 'cfr-550-55', 'ps-5331', 'ps-5410'],
  },
  {
    step: 'FSA time credits',
    body: '10 days for every 30 days of successful participation, 15 for minimum and low risk. Like BOP’s own projection, we count completed 30-day periods served, start everyone at 10 and switch to 15 after the seventh period, and stop earning at transfer.',
    cite: ['usc-3632d4', 'cfr-523-42', 'ps-5410'],
  },
  {
    step: 'Applying the credits',
    body: 'On the first day the credits earned equal the time left, they are applied: up to 12 months to start supervised release early (only if the judgment includes it), and the rest to an earlier move to a halfway house or home confinement.',
    cite: ['usc-3624g', 'cfr-523-44'],
  },
  {
    step: 'Second Chance Act placement',
    body: 'BOP may add up to 12 months of halfway-house time (home confinement: the shorter of 10% of the term or 6 months) on top of credit days. It is decided case by case, so the calculator leaves it at zero unless you choose an assumption.',
    cite: ['usc-3624c', 'ps-5410'],
  },
  {
    step: 'Weekends',
    body: 'If a release date falls on a weekend, BOP may release on the weekday before. Legal holidays at the place of confinement can move it too; we don’t adjust for holidays.',
    cite: ['usc-3624a'],
  },
];

const UNSETTLED = [
  {
    t: 'Earning before arrival',
    b: 'From September 30, 2026, an interim rule lets credits start when the sentence commences — including time held awaiting transport — rather than on arrival. The rule is open for comment, BOP says people still need assigned programming, and it doesn’t say whether it reaches back to people already in custody. Use “days before earning starts” to model the old rule.',
    cite: ['fr-2026-17752'] as SourceId[],
  },
  {
    t: 'When the 15-day rate starts',
    b: 'The statute gives 15 days per 30 after two consecutive minimum/low assessments. BOP’s worked examples switch after the seventh 30-day period; real assessment dates vary.',
    cite: ['usc-3632d4', 'ps-5410'] as SourceId[],
  },
  {
    t: '“365 days” or “12 months”',
    b: 'The statute and regulation say 12 months toward supervised release; BOP’s policy says 365 days. BOP’s own RDAP example subtracts a calendar year across a leap day, so we use 12 calendar months. Expect ±1 day.',
    cite: ['usc-3624g', 'ps-5410'] as SourceId[],
  },
  {
    t: 'How Second Chance Act time stacks',
    b: 'BOP says credit days and Second Chance Act days are added together, but no public document spells out the arithmetic — for instance how the 10%/6-month home-confinement cap interacts with credit days. Treat that part of the timeline as “up to.”',
    cite: ['ps-5410', 'usc-3624c'] as SourceId[],
  },
  {
    t: 'BOP’s own examples',
    b: 'This calculator reproduces every date in BOP’s 2026 time-credit handout and its good-conduct-time table — except one: the handout’s 120-month placement date (Sept. 28, 2030) is four days earlier than its own credit count gives (Oct. 2, 2030). We follow the arithmetic.',
    cite: ['ps-5410'] as SourceId[],
  },
  {
    t: 'A case before the Supreme Court',
    b: 'Maxwell v. Dinis (No. 25-5930) asks whether people can use a habeas petition to challenge how credits were applied to halfway-house or home-confinement placement. It concerns how such claims reach court, not the arithmetic.',
    cite: [] as SourceId[],
  },
];

const FAQS = [
  {
    q: 'How do I calculate a federal release date with First Step Act credits?',
    a: 'Start from the full term, subtract good conduct time (up to 54 days per year of the sentence imposed), subtract any RDAP reduction, then apply FSA time credits — 10 or 15 days per 30 days served — once they equal the time left: up to 12 months to early supervised release and the rest to a halfway house or home confinement. The calculator above does this the way the Bureau of Prisons’ own examples do.',
  },
  {
    q: 'How accurate is this First Step Act calculator?',
    a: 'It reproduces every worked example in the Bureau of Prisons’ 2026 FSA Time Credit Application Guide and its good-conduct-time table, to the day. Real dates move with jail credit, time out of earning status, discipline, assessment dates and Second Chance Act decisions — and the Bureau computes the official date.',
  },
  {
    q: 'What is the maximum time the First Step Act can take off a sentence?',
    a: 'Up to 12 months of time credits can be applied to an earlier start of supervised release (18 U.S.C. § 3624(g)(3)). There is no cap on credits applied to prerelease custody — halfway house or home confinement.',
  },
  {
    q: 'Does good conduct time count the sentence imposed or time served?',
    a: 'The sentence imposed. Since the First Step Act, it is up to 54 days for each year of the sentence imposed by the court (18 U.S.C. § 3624(b)(1)), prorated for a partial final year (28 CFR 523.20).',
  },
  {
    q: 'Who cannot earn First Step Act time credits?',
    a: 'People serving a sentence for any of 68 listed offenses in 18 U.S.C. § 3632(d)(4)(D) — including § 924(c) firearms offenses and most violent, sex and terrorism offenses. People with a final order of removal can earn credits but cannot have them applied.',
  },
];

export default function CalculatorPage() {
  return (
    <>
      <section className="band-night overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14 print:pb-4">
        <Container width="wide">
          <Breadcrumbs
            className="print:hidden"
            items={[
              { name: 'Home', path: '/' },
              { name: 'Release calculator', path: '/calculator' },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <Eyebrow className="!text-accent">Free · no sign-up · every rule cited</Eyebrow>
              <h1 className="mt-4 text-4xl text-ink sm:text-5xl">
                First Step Act <em className="serif-italic text-accent">release date</em> calculator
              </h1>
              <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
                Good conduct time, FSA time credits, RDAP and halfway-house or home
                confinement dates, laid out on one timeline — computed the way the
                Bureau of Prisons’ own worked examples compute them.
              </p>
            </div>
            <figure className="border-l border-accent/60 pl-5 print:hidden">
              <blockquote className="serif-italic text-2xl leading-snug text-ink">&ldquo;{VERSE.text}&rdquo;</blockquote>
              <figcaption className="eyebrow mt-3">{VERSE.ref}</figcaption>
            </figure>
          </div>
          <p className="mt-10 max-w-4xl border border-rule bg-paper-raised/60 px-5 py-4 text-sm leading-relaxed text-ink-soft">
            <strong className="text-ink">An estimate, not legal advice.</strong> The Bureau of Prisons computes the
            official dates, and they move with jail credit, discipline, programming, assessments and placement
            decisions. Check any date that matters with the unit team or a lawyer.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20" aria-label="Calculator">
        <Container width="wide">
          <Suspense fallback={<div className="h-[60rem]" aria-hidden />}>
            <Calculator />
          </Suspense>
        </Container>
      </section>

      <section id="method" className="border-t border-rule py-16 sm:py-24" aria-labelledby="method-h">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow className="!text-accent">Method</Eyebrow>
              <h2 id="method-h" className="mt-4 text-4xl text-ink">How the estimate is built.</h2>
              <p className="mt-5 max-w-prose leading-relaxed text-ink-soft">
                Seven steps, each tied to the statute, regulation or Bureau policy it comes from.
                <code className="mx-1 text-sm">npm run verify:fsa-calc</code> checks the maths against the Bureau’s own
                worked examples on every build.
              </p>
            </div>
            <ol className="border-t border-rule">
              {METHOD.map((m, i) => (
                <li key={m.step} className="grid gap-x-6 gap-y-2 border-b border-rule py-6 sm:grid-cols-[3rem_1fr]">
                  <span className="numeral text-3xl text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-2xl text-ink">{m.step}</h3>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">{m.body}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      {m.cite.map((c) => (
                        <a key={c} href={`#rule-${c}`} className="text-accent underline-offset-4 hover:underline">
                          {SOURCES[c].cite}
                        </a>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="band-night py-16 sm:py-24" aria-labelledby="unsettled-h">
        <Container width="wide">
          <Eyebrow className="!text-accent">Honest limits</Eyebrow>
          <h2 id="unsettled-h" className="mt-4 max-w-3xl text-4xl text-ink">Where the rules are unsettled.</h2>
          <div className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2 xl:grid-cols-3">
            {UNSETTLED.map((u) => (
              <div key={u.t} className="bg-paper p-7">
                <h3 className="text-2xl text-ink">{u.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{u.b}</p>
                {u.cite.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-4 text-xs">
                    {u.cite.map((c) => (
                      <a key={c} href={`#rule-${c}`} className="text-accent hover:underline">
                        {SOURCES[c].cite}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="faq-h">
        <Container>
          <Eyebrow className="!text-accent">Questions</Eyebrow>
          <h2 id="faq-h" className="mt-4 text-4xl text-ink">Questions people ask.</h2>
          <FaqList faqs={FAQS} className="mt-8" />
          <p className="mt-8 text-sm text-ink-muted">
            More in the guides:{' '}
            <Link href="/guides/how-first-step-act-time-credits-work" className="text-accent underline underline-offset-4">
              how FSA time credits work
            </Link>
            ,{' '}
            <Link href="/guides/pattern-risk-levels-explained" className="text-accent underline underline-offset-4">
              PATTERN risk levels
            </Link>
            ,{' '}
            <Link href="/guides/home-confinement-vs-halfway-house" className="text-accent underline underline-offset-4">
              home confinement vs. RRC
            </Link>
            .
          </p>
        </Container>
      </section>

      <section id="excluded" className="scroll-mt-24 border-t border-rule py-16" aria-labelledby="excluded-h">
        <Container>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="eyebrow block !text-accent">18 U.S.C. § 3632(d)(4)(D)</span>
                <span id="excluded-h" className="mt-3 block font-display text-3xl text-ink">
                  The {INELIGIBLE_OFFENSES.length} offenses that cannot earn time credits
                </span>
              </span>
              <span aria-hidden className="numeral text-3xl text-accent transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-ink-soft">
              Verbatim from the statute. A sentence for any of these makes the person ineligible to earn credits;
              the Fourth Circuit has held that one listed count in an aggregate sentence disqualifies the whole of it (Bonnie v. Dunbar, 2025). A final
              order of removal doesn’t stop earning, but stops the credits being applied (§ 3632(d)(4)(E)).
            </p>
            <ol className="mt-6 columns-1 gap-10 text-sm leading-relaxed text-ink-soft md:columns-2">
              {INELIGIBLE_OFFENSES.map((o) => (
                <li key={o.clause} className="mb-3 break-inside-avoid">
                  <span className="numeral mr-2 text-accent">({o.clause})</span>
                  {o.text}
                </li>
              ))}
            </ol>
          </details>
        </Container>
      </section>

      <section id="sources" className="border-t border-rule py-16" aria-labelledby="sources-h">
        <Container>
          <h2 id="sources-h" className="eyebrow">Sources — read in full on 26 September 2026</h2>
          <ol className="mt-6 space-y-5">
            {Object.values(SOURCES).map((s) => (
              <li key={s.id} id={`rule-${s.id}`} className="scroll-mt-24 border-b border-rule pb-5 text-sm">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:text-accent">
                  {s.cite}
                </a>
                <span className="text-ink-muted"> — {s.title}</span>
                <blockquote className="mt-2 border-l border-accent/50 pl-3 text-xs italic leading-relaxed text-ink-muted">
                  “{s.quote}”
                </blockquote>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <JsonLd
        data={[
          calculatorLd(),
          faqLd(FAQS),
        ]}
      />
    </>
  );
}
