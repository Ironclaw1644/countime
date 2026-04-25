import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PullQuote } from '@/components/ui/PullQuote';
import { MapSection } from '@/components/map/MapSection';
import {
  faLocationDot,
  faStethoscope,
  faShieldHeart,
  faArrowRight,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import { getAllFacilities } from '@/lib/facilities';

export default function HomePage() {
  const facilities = getAllFacilities();
  const fpcCount = facilities.length;
  const rdapCount = facilities.filter((f) => f.hasRDAP).length;
  const medCount = facilities.filter((f) => f.isMedical).length;

  return (
    <>
      {/* Hero */}
      <Section className="pt-12 pb-10 sm:pt-20 sm:pb-12">
        <Container width="default">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <p
                data-reveal="1"
                className="small-caps text-[11px] text-clay-deep"
              >
                For families navigating federal sentencing
              </p>
              <h1
                data-reveal="2"
                className="font-display mt-4 text-balance text-5xl leading-[1.02] tracking-tightest text-ink sm:text-6xl md:text-[5.25rem]"
              >
                Know where they&rsquo;re going.{' '}
                <em className="text-clay-deep">Plan</em> what comes next.
              </h1>
              <p
                data-reveal="3"
                className="mt-7 max-w-xl text-pretty text-[17px] leading-relaxed text-ink-soft sm:text-lg"
              >
                Countime is a quiet companion for white-collar offenders and the
                people who love them. Find every Federal Prison Camp on a map,
                see which one is likely closest to home, and download the
                handbook for the facility you need.
              </p>

              <div data-reveal="4" className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="#map" size="lg" variant="primary">
                  Open the camp map
                  <Icon icon={faArrowRight} />
                </ButtonLink>
                <ButtonLink href="/handbooks" size="lg" variant="outline">
                  <Icon icon={faBook} />
                  Browse handbooks
                </ButtonLink>
              </div>
            </div>

            <aside
              data-reveal="5"
              className="rounded-3xl border border-ink/10 bg-cream-50/70 p-6 shadow-paper backdrop-blur"
            >
              <p className="small-caps text-[10px] text-ink-muted">By the numbers</p>
              <dl className="mt-3 grid grid-cols-3 gap-4 text-center">
                <Stat value={fpcCount} label="Camps mapped" />
                <Stat value={rdapCount} label="Offer RDAP" />
                <Stat value={medCount} label="Medical" />
              </dl>
              <p className="mt-5 text-[13px] leading-relaxed text-ink-soft">
                The Bureau of Prisons aims to place inmates within{' '}
                <strong className="text-ink">500 miles</strong> of home when
                possible. Enter your ZIP on the map to see who that puts in
                reach.
              </p>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Map */}
      <MapSection />

      {/* Three-column explainer */}
      <Section className="py-20 sm:py-28">
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="small-caps text-[11px] text-clay-deep">
              How to read this map
            </p>
            <h2 className="font-display rule-under mt-3 text-4xl leading-tight tracking-tightest text-ink sm:text-5xl">
              A map made for one careful question.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
              We didn&rsquo;t build a directory. We built a way to look at one
              difficult moment and see what&rsquo;s actually nearby.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Explainer
              icon={faLocationDot}
              tone="clay"
              title="Every Federal Prison Camp"
              body="Marker by marker — standalone camps, satellite camps, and the medical centers that house minimum-custody inmates. Click any of them for the address, phone, and a&nbsp;handbook."
            />
            <Explainer
              icon={faShieldHeart}
              tone="gold"
              title="A 500-mile reach for each"
              body="The BOP&rsquo;s designation guideline is to keep families within 500 miles when they can. Hover a camp to see its reach, or enter your ZIP to see which camps are in yours."
            />
            <Explainer
              icon={faStethoscope}
              tone="teal"
              title="Medical &amp; RDAP marked clearly"
              body="Teal markers are Federal Medical Centers and the Medical Center for Federal Prisoners. A gold ring means RDAP — the residential drug program — is offered there."
            />
          </div>
        </Container>
      </Section>

      {/* Pull-quote */}
      <Section className="py-16 sm:py-20">
        <Container>
          <PullQuote attribution="A note we keep close">
            It&rsquo;s going to be okay. There is a way through this, and a lot
            of people who&rsquo;ve walked it before you.
          </PullQuote>
        </Container>
      </Section>

      {/* CTA strip */}
      <Section className="pb-24 pt-0">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-cream-100 via-cream-50 to-cream p-10 shadow-paper sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-clay/15 blur-3xl"
            />
            <div className="relative grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-center">
              <div>
                <p className="small-caps text-[11px] text-clay-deep">
                  Handbook library
                </p>
                <h3 className="font-display mt-3 text-3xl leading-tight tracking-tightest text-ink sm:text-4xl">
                  The official A&amp;O handbook for every camp, in one quiet place.
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                  These are the documents the Bureau of Prisons gives every
                  inmate in their first week. We&rsquo;ve gathered them so
                  families can read along — and arrive prepared.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <ButtonLink href="/handbooks" size="lg">
                  Open the library
                  <Icon icon={faArrowRight} />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="font-display text-3xl leading-none tracking-tightest text-clay-deep">
        {value}
      </dt>
      <dd className="mt-1.5 text-[11px] uppercase tracking-wide text-ink-muted">
        {label}
      </dd>
    </div>
  );
}

function Explainer({
  icon,
  title,
  body,
  tone,
}: {
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  title: string;
  body: string;
  tone: 'clay' | 'gold' | 'teal';
}) {
  const tones = {
    clay: 'bg-clay/12 text-clay-deep',
    gold: 'bg-gold/20 text-gold-deep',
    teal: 'bg-teal/15 text-teal-deep',
  };
  return (
    <article className="group relative">
      <div
        className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${tones[tone]}`}
      >
        <Icon icon={icon} className="text-lg" />
      </div>
      <h3 className="font-display text-2xl leading-tight tracking-tightest text-ink">
        {title}
      </h3>
      <p
        className="mt-3 text-[15px] leading-relaxed text-ink-soft"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}
