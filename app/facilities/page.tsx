import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Chip } from '@/components/ui/Chip';
import { MapSection } from '@/components/map/MapSection';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import {
  getAllFacilities,
  isClosed,
  isHoldingFacility,
  STATE_NAME,
  STATUS_LABEL,
  TYPE_LABEL,
} from '@/lib/facilities';
import { JsonLd, pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import type { Facility } from '@/types/facility';

export const metadata = pageMetadata({
  title: 'Federal prison camp map & directory — every BOP minimum-security facility',
  ogTitle: 'Every federal prison camp on one map',
  description:
    'Interactive map and state-by-state directory of every federal prison camp, satellite camp, medical center and holding facility — address, phone, RDAP, self-surrender and the official A&O handbook for each.',
  path: '/facilities',
});

const STATUS_TONE = { CLOSED: 'closed', CLOSING: 'warn', CONVERTING: 'warn', OPEN: 'neutral' } as const;

export default function FacilitiesPage() {
  const all = getAllFacilities();
  const byState = new Map<string, Facility[]>();
  for (const f of [...all].sort((a, b) => a.name.localeCompare(b.name))) {
    byState.set(f.state, [...(byState.get(f.state) ?? []), f]);
  }
  const states = [...byState.keys()].sort((a, b) =>
    (STATE_NAME[a] ?? a).localeCompare(STATE_NAME[b] ?? b),
  );
  const live = all.filter((f) => !isClosed(f));

  return (
    <>
      <section className="band-night overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14">
        <Container width="wide">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Facilities', path: '/facilities' }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Eyebrow className="!text-accent">Map &amp; directory</Eyebrow>
              <h1 className="mt-4 text-4xl text-ink lg:text-[4.25rem]">
                Every federal prison camp on one map
              </h1>
            </div>
            <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
              {live.length}{' '}minimum-security camps, medical centers and holding
              facilities, checked against the Bureau of Prisons&rsquo; own directory
              and population report. Camps that have closed are still listed, so a
              search by name still gets an answer.
            </p>
          </div>
        </Container>
      </section>

      <MapSection eager />

      <section className="py-16 sm:py-24" aria-labelledby="directory">
        <Container width="wide">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
            <h2 id="directory" className="text-3xl text-ink">
              Directory by state
            </h2>
            <nav aria-label="Jump to state" className="flex max-w-3xl flex-wrap gap-x-1.5 gap-y-1">
              {states.map((s) => (
                <a key={s} href={`#state-${s}`} className="numeral inline-flex min-h-6 min-w-6 items-center justify-center px-1 text-base text-ink-muted hover:text-accent">
                  {s}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-4 columns-1 gap-12 md:columns-2 xl:columns-3">
            {states.map((s) => (
              <section key={s} id={`state-${s}`} className="scroll-mt-24 break-inside-avoid pt-8">
                <h3 className="flex items-baseline justify-between border-b border-rule-strong pb-2">
                  <span className="font-display text-2xl text-ink">{STATE_NAME[s] ?? s}</span>
                  <span className="numeral text-lg text-ink-faint">{byState.get(s)!.length}</span>
                </h3>
                <ul>
                  {byState.get(s)!.map((f) => (
                    <li key={f.id} className="border-b border-rule">
                      <Link href={`/facilities/${f.id}`} className="group block py-3">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-medium text-ink transition-colors group-hover:text-accent">
                            {f.name}
                          </span>
                          {f.status !== 'OPEN' && <Chip tone={STATUS_TONE[f.status]}>{STATUS_LABEL[f.status]}</Chip>}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          {TYPE_LABEL[f.type]} · {f.city}
                          {f.handbookUrl ? ' · A&O handbook' : ''}
                          {f.rdapAtFacility ? ' · RDAP' : ''}
                          {isHoldingFacility(f) ? ' · holding' : ''}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <JsonLd
        data={{
          '@type': 'ItemList',
          name: 'Federal prison camps and minimum-security facilities',
          numberOfItems: all.length,
          itemListElement: all.map((f, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/facilities/${f.id}`,
            name: f.name,
          })),
        }}
      />
    </>
  );
}
