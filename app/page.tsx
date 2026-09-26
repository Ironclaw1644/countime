import Link from 'next/link';
import { preload } from 'react-dom';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PullQuote } from '@/components/ui/PullQuote';
import { TallyMark } from '@/components/ui/Tally';
import { MapSection } from '@/components/map/MapSection';
import { LogoDisplay } from '@/components/brand/Logo';
import { ScriptureBand } from '@/components/scripture/ScriptureBand';
import { QuickEstimate } from '@/components/calculator/QuickEstimate';
import { NewsList } from '@/components/news/NewsList';
import { getAllFacilities, isHoldingFacility, isClosed } from '@/lib/facilities';
import { getNews } from '@/lib/news/feeds';
import { GUIDES } from '@/data/guides';
import { scripture } from '@/data/scripture';
import { pageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: `${SITE_NAME} — First Step Act calculator & federal prison camp guide`,
  ogTitle: 'Know the date. Prepare for the days.',
  description:
    'Free First Step Act release-date calculator with every rule cited, a map of every federal prison camp, the official A&O handbooks, a self-surrender checklist and plain-language guides for families.',
  path: '/',
});

const CHECKED_LABEL = 'August 2026';

const PATHS = [
  {
    href: '/calculator',
    kicker: 'Estimate',
    title: 'The release calculator',
    body: 'Good conduct time, First Step Act credits, RDAP and halfway-house time on one timeline — every rule cited to the statute.',
    cta: 'Estimate a date',
  },
  {
    href: '/facilities',
    kicker: 'Locate',
    title: 'The facility map',
    body: 'Every federal camp, medical center and holding facility — what is open, what is closing, and how far each one is from home.',
    cta: 'Open the map',
  },
  {
    href: '/checklist',
    kicker: 'Prepare',
    title: 'The surrender checklist',
    body: 'What to do at ninety days out, sixty, thirty, seven, and on the morning itself. Free, and built to be printed.',
    cta: 'Start the checklist',
  },
  {
    href: '/guides',
    kicker: 'Understand',
    title: 'Guides & news',
    body: 'How time credits work, what PATTERN scores mean, RRC versus home confinement — and the week’s Bureau of Prisons news.',
    cta: 'Read the guides',
  },
];

export default async function HomePage() {
  preload('/brand/countime-logotype-mask.png', { as: 'image', fetchPriority: 'high' });

  const facilities = getAllFacilities();
  const live = facilities.filter((f) => !isClosed(f));
  const rdapCount = facilities.filter((f) => f.rdapAtFacility && f.rdapStatus === 'ACTIVE').length;
  const medCount = live.filter((f) => f.isMedical).length;
  const holdingCount = live.filter(isHoldingFacility).length;
  const selfSurrenderCount = facilities.filter((f) => f.acceptsSelfSurrender).length;
  const changedCount = facilities.filter((f) => f.status !== 'OPEN').length;
  const { items: news } = await getNews({ limit: 6 });

  return (
    <>
      {/* ── Hero: night, the logotype written on, and the one question most
             people arrive with — "when?" — answerable right here. */}
      <section className="band-night overflow-hidden">
        <Container width="wide">
          <div className="pb-16 pt-8 sm:pb-24 sm:pt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <Eyebrow className="!text-accent">For families facing federal prison</Eyebrow>
              <Eyebrow className="tabular">
                {live.length} facilities · checked {CHECKED_LABEL}
              </Eyebrow>
            </div>

            <div className="mt-8 text-ink sm:mt-10">
              <LogoDisplay animate />
            </div>

            <div className="mt-10 grid gap-12 border-t border-rule pt-10 sm:mt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
              <div>
                <h1 className="text-4xl text-ink sm:text-5xl">
                  Know the date.{' '}
                  <em className="serif-italic block text-accent">Prepare for the days.</em>
                </h1>
                <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
                  A free First Step Act release calculator with every rule cited,
                  a current map of every federal prison camp, the Bureau&rsquo;s own
                  handbooks, and plain answers — built for the people who love
                  someone going in.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ButtonLink href="/calculator" size="lg" className="rounded-full">
                    Open the calculator
                  </ButtonLink>
                  <ButtonLink href="/facilities" size="lg" variant="outline" className="rounded-full">
                    Find a facility
                  </ButtonLink>
                </div>
              </div>
              <QuickEstimate />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Four ways in */}
      <section className="py-16 sm:py-24" aria-labelledby="start-here">
        <Container width="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="!text-accent">Start here</Eyebrow>
              <h2 id="start-here" data-reveal data-reveal-style="wipe" className="mt-4 text-4xl text-ink">
                <span>Four things, in the order people need them.</span>
              </h2>
            </div>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2 xl:grid-cols-4">
            {PATHS.map((p, i) => (
              <li key={p.href} data-reveal={String(i + 1)} className="bg-paper">
                <Link
                  href={p.href}
                  className="group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-paper-raised sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="numeral text-5xl text-ink-faint/50 transition-colors duration-300 group-hover:text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <TallyMark count={i + 1} className="h-7 w-9 text-ink-faint transition-colors group-hover:text-accent" />
                  </div>
                  <p className="eyebrow mt-10">{p.kicker}</p>
                  <h3 className="mt-2 text-3xl text-ink">{p.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{p.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-ink">
                    {p.cta}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── The ledger */}
      <section className="pb-16 sm:pb-20">
        <Container width="wide">
          <dl className="grid grid-cols-2 border-t border-rule md:grid-cols-4">
            <Stat n="01" value={live.length} label="Facilities mapped" href="/facilities" />
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
      </section>

      {/* ── Map */}
      <MapSection />

      <section className="py-16 sm:py-24">
        <Container>
          <PullQuote verse={scripture('deuteronomy-31-8-short')} />
        </Container>
      </section>

      {/* ── How to read the map */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="mb-12 max-w-2xl">
            <Eyebrow className="!text-accent">How to read the map</Eyebrow>
            <h2 data-reveal data-reveal-style="wipe" className="mt-4 text-4xl text-ink">
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
      </section>

      <ScriptureBand />

      {/* ── Guides + news */}
      <section className="py-20 sm:py-28">
        <Container width="wide">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <Eyebrow className="!text-accent">Guides</Eyebrow>
              <h2 data-reveal data-reveal-style="wipe" className="mt-4 text-4xl text-ink">
                <span>The rules, in plain words.</span>
              </h2>
              <ul className="mt-10 border-t border-rule">
                {GUIDES.map((g, i) => (
                  <li key={g.slug} data-reveal={String(i + 1)} className="border-b border-rule">
                    <Link href={`/guides/${g.slug}`} className="group grid grid-cols-[3rem_1fr] gap-4 py-6">
                      <span className="numeral text-2xl text-ink-faint transition-colors group-hover:text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className="font-display text-2xl leading-snug text-ink transition-colors group-hover:text-accent">
                          {g.title}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">{g.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow className="!text-accent">This week</Eyebrow>
              <h2 data-reveal data-reveal-style="wipe" className="mt-4 text-4xl text-ink">
                <span>First Step Act news.</span>
              </h2>
              {news.length > 0 ? (
                <div className="mt-6">
                  <NewsList items={news} />
                </div>
              ) : (
                <p className="mt-10 text-ink-muted">The news feeds are quiet right now — try the news page shortly.</p>
              )}
              <Link href="/news" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover">
                All the news, updated hourly <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Handbooks */}
      <section className="pb-8">
        <Container width="wide">
          <div className="grid gap-8 border-t border-rule pt-12 md:grid-cols-[1.6fr_1fr] md:items-end">
            <div>
              <Eyebrow className="!text-accent">Handbook library</Eyebrow>
              <h2 data-reveal data-reveal-style="wipe" className="mt-4 max-w-3xl text-4xl text-ink">
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
              <ButtonLink href="/handbooks" size="lg" className="rounded-full">
                Open the library
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ n, value, label, href }: { n: string; value: number; label: string; href?: string }) {
  return (
    <div
      data-reveal
      className="flex flex-col border-b border-rule px-1 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
    >
      <span aria-hidden className="eyebrow tabular block !text-ink-faint">{n}</span>
      <dd className="numeral order-2 mt-6 text-5xl text-ink">
        {href ? (
          <Link href={href} className="transition-colors hover:text-accent" aria-label={`${value} ${label.toLowerCase()}`}>
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
      <dt className="order-3 mt-2 text-sm text-ink-muted">{label}</dt>
    </div>
  );
}

function Explainer({ title, body }: { title: string; body: string }) {
  return (
    <article data-reveal>
      <h3 className="text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
    </article>
  );
}
