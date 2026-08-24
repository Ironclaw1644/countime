import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PullQuote } from '@/components/ui/PullQuote';
import { MapSection } from '@/components/map/MapSection';
import { LogoDisplay } from '@/components/brand/Logo';
import { getAllFacilities, isHoldingFacility, isClosed } from '@/lib/facilities';

const CHECKED_LABEL = 'August 2026';

const CONTENTS = [
  {
    n: '01',
    href: '#map',
    title: 'The map',
    body: 'Every federal minimum-security camp, medical center, and holding facility — with what is open, what is closing, and how far each one is from your ZIP.',
  },
  {
    n: '02',
    href: '/handbooks',
    title: 'The handbooks',
    body: 'The Admission & Orientation handbook the Bureau hands every new arrival, linked straight from bop.gov for each facility that publishes one.',
  },
  {
    n: '03',
    href: '/the-inside',
    title: 'The Inside',
    body: 'Plain-language entries on counts, recall, shots, R&D, diesel therapy — the vocabulary nobody explains to you beforehand.',
  },
  {
    n: '04',
    href: '/checklist',
    title: 'The checklist',
    body: 'What to do at ninety days out, sixty, thirty, seven, and on the morning itself. Free, and built to be printed.',
  },
  {
    n: '05',
    href: '/updates',
    title: 'What changed',
    body: 'A dated log of camp closures, conversions, and BOP announcements, with the source for each one.',
  },
];

export default function HomePage() {
  const facilities = getAllFacilities();
  const live = facilities.filter((f) => !isClosed(f));
  const rdapCount = facilities.filter((f) => f.rdapAtFacility && f.rdapStatus === 'ACTIVE').length;
  const medCount = live.filter((f) => f.isMedical).length;
  const womensCount = live.filter((f) => f.gender === 'FEMALE').length;
  const holdingCount = live.filter(isHoldingFacility).length;
  const selfSurrenderCount = facilities.filter((f) => f.acceptsSelfSurrender).length;
  const changedCount = facilities.filter((f) => f.status !== 'OPEN').length;

  return (
    <>
      {/* Hero — the logotype is the headline, at full width. No serif
          display line, no italicised word; the lettering carries it. */}
      <section className="relative overflow-hidden border-b border-rule">
        <Container width="wide">
          <div className="pb-14 pt-10 sm:pb-20 sm:pt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <Eyebrow data-reveal="1" className="!text-accent">
                For families navigating federal sentencing
              </Eyebrow>
              <Eyebrow data-reveal="1" className="tabular">
                {live.length} facilities · checked {CHECKED_LABEL}
              </Eyebrow>
            </div>

            {/* No scroll-reveal here — the write-on animation is the entrance. */}
            <div className="mt-8 text-ink sm:mt-10">
              <LogoDisplay animate />
            </div>

            <div className="mt-10 grid gap-8 border-t border-rule pt-8 sm:mt-14 md:grid-cols-[1fr_auto] md:items-end">
              <p data-reveal="3" className="max-w-prose text-lg leading-relaxed text-ink-soft">
                A calm, current map of every federal minimum-security camp —
                checked against the Bureau&rsquo;s own records, including the
                ones that have closed. Built for the people who love someone
                going in.
              </p>
              <div data-reveal="4" className="flex flex-wrap items-center gap-3">
                <ButtonLink href="#map" size="lg" variant="primary">
                  Open the map
                </ButtonLink>
                <ButtonLink href="/checklist" size="lg" variant="outline">
                  Surrender checklist
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Ledger row — the numbers, ruled like a page */}
      <Section className="py-12 sm:py-16">
        <Container width="wide">
          <dl className="grid grid-cols-2 border-t border-rule md:grid-cols-4">
            <Stat n="01" value={live.length} label="Facilities mapped" />
            <Stat n="02" value={selfSurrenderCount} label="Take self-surrender" />
            <Stat n="03" value={rdapCount} label="Run RDAP on site" />
            <Stat n="04" value={changedCount} label="Closed or changing" href="/updates" />
          </dl>
          <p className="mt-8 max-w-prose text-sm leading-relaxed text-ink-muted">
            The Bureau aims to place people within{' '}
            <strong className="font-medium text-ink-soft">500 miles</strong> of home
            when it can — though almost everyone passes through a holding facility
            first. {medCount} medical centers and {holdingCount} holding facilities
            are mapped alongside the camps.
          </p>
        </Container>
      </Section>

      {/* Map */}
      <MapSection />

      {/* Front matter */}
      <Section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="text-accent">Contents</Eyebrow>
            <h2 data-reveal data-reveal-style="wipe" className="mt-4 text-3xl text-ink">
              <span>Five things worth knowing before the day comes.</span>
            </h2>
          </div>

          <ol className="mt-12 border-t border-rule">
            {CONTENTS.map((item) => (
              <li key={item.n} data-reveal className="border-b border-rule">
                <Link
                  href={item.href}
                  className="group grid gap-x-8 gap-y-2 py-7 transition-colors sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline"
                >
                  <span className="tabular text-sm text-ink-faint transition-colors group-hover:text-accent">
                    {item.n}
                  </span>
                  <span className="font-display text-xl text-ink transition-colors group-hover:text-accent">
                    {item.title}
                  </span>
                  <span className="max-w-prose text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* How to read the map */}
      <Section className="pb-20 pt-0 sm:pb-28">
        <Container>
          <div className="mb-12 max-w-2xl">
            <Eyebrow className="text-accent">How to read the map</Eyebrow>
            <h2 data-reveal data-reveal-style="wipe" className="mt-4 text-3xl text-ink">
              <span>A map made for one careful question.</span>
            </h2>
            <p className="mt-5 max-w-prose leading-relaxed text-ink-soft">
              Not a directory — a way to look at one difficult moment and see
              what is actually nearby, and what is actually still open.
            </p>
          </div>

          <div className="grid gap-10 border-t border-rule pt-10 md:grid-cols-3">
            <Explainer
              title="Shape tells you what kind"
              body="A circle is a camp. A square is a federal medical center. A diamond is a holding or detention facility — somewhere people pass through, not somewhere they serve a sentence."
            />
            <Explainer
              title="Fill tells you what state it is in"
              body="Solid means open. Hollow means the Bureau has announced it is closing, or converting to a security level that is no longer a camp. Crossed through means closed — kept on the map, with the date and the reason."
            />
            <Explainer
              title="A ring means RDAP on site"
              body="The residential drug program can take up to a year off a sentence. The ring marks camps that run it themselves — not ones whose parent prison runs it, which would mean transferring off the camp to join."
            />
          </div>
        </Container>
      </Section>

      <Section className="py-12 sm:py-16">
        <Container>
          <PullQuote attribution="A note we keep close">
            It&rsquo;s going to be okay. There is a way through this, and a lot
            of people who&rsquo;ve walked it before you.
          </PullQuote>
        </Container>
      </Section>

      {/* Closing CTA */}
      <Section className="pb-24 pt-4">
        <Container>
          <div className="grid gap-8 border-t border-rule pt-12 md:grid-cols-[1.6fr_1fr] md:items-end">
            <div>
              <Eyebrow className="text-accent">Handbook library</Eyebrow>
              <h2 data-reveal data-reveal-style="wipe" className="mt-4 max-w-2xl text-2xl text-ink">
                <span>The official A&amp;O handbook for every facility that publishes one.</span>
              </h2>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">
                These are the documents the Bureau gives every person in their
                first week. Each link here was checked against bop.gov — where
                the Bureau publishes no handbook, we say so rather than sending
                you to a dead page.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <ButtonLink href="/handbooks" size="lg">
                Open the library
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Stat({
  n,
  value,
  label,
  href,
}: {
  n: string;
  value: number;
  label: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="eyebrow tabular block !text-ink-faint">{n}</span>
      <dt className="tabular mt-6 font-display text-3xl font-semibold leading-none text-ink">
        {value}
      </dt>
      <dd className="mt-2 text-sm text-ink-muted">{label}</dd>
    </>
  );
  return (
    <div
      data-reveal
      className="border-b border-rule px-1 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
    >
      {href ? (
        <Link href={href} className="group block transition-colors hover:text-accent">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}
function Explainer({ title, body }: { title: string; body: string }) {
  return (
    <article data-reveal>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
    </article>
  );
}
