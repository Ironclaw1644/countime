'use client';

import { useMemo, useState } from 'react';
import { HandbookCard } from './HandbookCard';
import { Icon } from '@/components/ui/Icon';
import {
  faMagnifyingGlass,
  faXmark,
  faShieldHeart,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/cn';
import type { Facility } from '@/types/facility';

const REGION_ORDER: Facility['region'][] = ['Northeast', 'Midwest', 'South', 'West'];

export function HandbookLibrary({ facilities }: { facilities: Facility[] }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<Facility['region'] | 'All'>('All');
  const [rdapOnly, setRdapOnly] = useState(false);
  const [medicalOnly, setMedicalOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return facilities.filter((f) => {
      if (q && !f.name.toLowerCase().includes(q) && !f.city.toLowerCase().includes(q) && !f.state.toLowerCase().includes(q)) {
        return false;
      }
      if (region !== 'All' && f.region !== region) return false;
      if (rdapOnly && !f.hasRDAP) return false;
      if (medicalOnly && !f.isMedical) return false;
      return true;
    });
  }, [facilities, query, region, rdapOnly, medicalOnly]);

  const grouped = useMemo(() => {
    const map = new Map<Facility['region'], Facility[]>();
    for (const r of REGION_ORDER) map.set(r, []);
    for (const f of filtered) map.get(f.region)?.push(f);
    return map;
  }, [filtered]);

  const activeCount =
    (query ? 1 : 0) + (region !== 'All' ? 1 : 0) + (rdapOnly ? 1 : 0) + (medicalOnly ? 1 : 0);

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-16 z-20 -mx-5 mb-10 border-y border-ink/10 bg-cream/85 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 sm:top-20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-cream-50/80 px-4 py-2.5 lg:max-w-md">
            <Icon icon={faMagnifyingGlass} className="text-ink-muted" />
            <input
              type="search"
              placeholder="Search by camp, city, or state"
              aria-label="Search handbooks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="text-ink-muted hover:text-ink"
              >
                <Icon icon={faXmark} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RegionTab
              label="All"
              active={region === 'All'}
              onClick={() => setRegion('All')}
            />
            {REGION_ORDER.map((r) => (
              <RegionTab
                key={r}
                label={r}
                active={region === r}
                onClick={() => setRegion(r)}
              />
            ))}

            <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />

            <ProgramToggle
              active={rdapOnly}
              onClick={() => setRdapOnly((v) => !v)}
              icon={faShieldHeart}
              label="RDAP"
            />
            <ProgramToggle
              active={medicalOnly}
              onClick={() => setMedicalOnly((v) => !v)}
              icon={faStethoscope}
              label="Medical"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-ink-muted">
          <p>
            <span className="font-medium text-ink">{filtered.length}</span> of{' '}
            {facilities.length} facilities
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRegion('All');
                setRdapOnly(false);
                setMedicalOnly(false);
              }}
              className="underline-offset-2 hover:text-ink hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid grouped by region */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink-muted">
          No facilities match those filters yet.
        </p>
      ) : (
        <div className="space-y-16">
          {REGION_ORDER.map((r) => {
            const list = grouped.get(r) ?? [];
            if (list.length === 0) return null;
            return (
              <section key={r}>
                <header className="mb-6 flex items-end justify-between">
                  <h2 className="font-display text-3xl leading-tight tracking-tightest text-ink sm:text-4xl">
                    {r}
                  </h2>
                  <span className="small-caps text-[10px] text-ink-muted">
                    {list.length} {list.length === 1 ? 'facility' : 'facilities'}
                  </span>
                </header>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((f) => (
                    <HandbookCard key={f.id} facility={f} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function RegionTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'bg-ink text-cream-50'
          : 'text-ink-soft hover:bg-cream-100 hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}

function ProgramToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'border-clay bg-clay text-cream-50'
          : 'border-ink/15 bg-cream-50/60 text-ink-soft hover:bg-cream-100',
      )}
    >
      <Icon icon={icon} />
      {label}
    </button>
  );
}
