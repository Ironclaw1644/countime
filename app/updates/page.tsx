import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Chip } from '@/components/ui/Chip';
import { getAllFacilities, STATUS_LABEL } from '@/lib/facilities';
import type { Facility } from '@/types/facility';

export const metadata: Metadata = {
  title: 'Facility updates',
  description:
    'A dated log of federal prison camp closures, conversions and Bureau of Prisons announcements — with the source for each one.',
};

const TONE = {
  CLOSED: 'closed',
  CLOSING: 'warn',
  CONVERTING: 'warn',
  OPEN: 'accent',
} as const;

function formatDate(iso?: string): string {
  if (!iso) return 'Date not published';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

export default function UpdatesPage() {
  const changed = getAllFacilities()
    .filter((f) => f.status !== 'OPEN')
    .sort((a, b) => (b.statusEffective ?? '').localeCompare(a.statusEffective ?? ''));

  // Group by the month the change took effect, newest first.
  const groups = new Map<string, Facility[]>();
  for (const f of changed) {
    const key = f.statusEffective?.slice(0, 7) ?? 'unknown';
    groups.set(key, [...(groups.get(key) ?? []), f]);
  }

  return (
    <Section className="pb-24 pt-14 sm:pt-20">
      <Container width="default">
        <div className="max-w-2xl">
          <Eyebrow className="text-accent">Facility updates</Eyebrow>
          <h1 className="rule-under mt-4 text-3xl text-ink">What changed, and when.</h1>
          <p className="mt-6 leading-relaxed text-ink-soft">
            The Bureau closes, suspends and repurposes camps faster than most
            directories keep up with. Every change below is recorded against the
            Bureau&rsquo;s own announcement or facility directory, so you can
            check it yourself.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Facilities that have closed keep their page on this site rather than
            disappearing — people search for them by name for years afterwards,
            and a dated answer is more useful than a missing one.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {[...groups.entries()].map(([month, items]) => (
            <section key={month}>
              <h2 className="eyebrow border-b border-rule pb-3">
                {month === 'unknown'
                  ? 'Date not published'
                  : new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      timeZone: 'UTC',
                    })}
              </h2>
              <ul>
                {items.map((f) => (
                  <li key={f.id} data-reveal className="border-b border-rule py-7">
                    <div className="grid gap-x-8 gap-y-3 md:grid-cols-[16rem_1fr] md:items-baseline">
                      <div>
                        <Link
                          href={`/facilities/${f.id}`}
                          className="font-display text-xl text-ink transition-colors hover:text-accent"
                        >
                          {f.name}
                        </Link>
                        <p className="mt-1 text-xs text-ink-muted">
                          {f.city}, {f.state}
                        </p>
                        <div className="mt-2.5">
                          <Chip tone={TONE[f.status]}>{STATUS_LABEL[f.status]}</Chip>
                        </div>
                      </div>
                      <div>
                        <p className="max-w-prose text-sm leading-relaxed text-ink-soft">
                          {f.statusNote}
                        </p>
                        {f.statusSourceUrl && (
                          <a
                            href={f.statusSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-xs text-accent underline underline-offset-4 hover:text-accent-hover"
                          >
                            Source — Bureau of Prisons
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-14 max-w-prose border-t border-rule pt-6 text-xs leading-relaxed text-ink-muted">
          Populations shown across this site come from the Bureau&rsquo;s public
          population report; facility locations and contact details come from its
          facility directory. Both are checked by{' '}
          <code className="text-ink-soft">npm run validate:facilities</code>, which
          fails the build when this site and the Bureau disagree. Last reconciled{' '}
          {formatDate('2026-08-23')}.
        </p>
      </Container>
    </Section>
  );
}
