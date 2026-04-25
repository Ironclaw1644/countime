'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  faMagnifyingGlass,
  faXmark,
  faShieldHeart,
  faStethoscope,
  faSliders,
  faLocationCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/cn';
import { resolveZip } from '@/lib/geo';
import type { FacilityFilters } from '@/types/facility';

interface Props {
  filters: FacilityFilters;
  onChange: (next: Partial<FacilityFilters>) => void;
  allStates: string[];
}

export function MapFilters({ filters, onChange, allStates }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [zipInput, setZipInput] = useState(filters.userZip ?? '');
  const [zipError, setZipError] = useState<string | null>(null);

  // Debounce text query
  const [queryDraft, setQueryDraft] = useState(filters.query);
  useEffect(() => {
    const t = setTimeout(() => onChange({ query: queryDraft }), 220);
    return () => clearTimeout(t);
  }, [queryDraft, onChange]);

  function applyZip(zip: string) {
    if (!zip) {
      onChange({ userZip: null, userCoords: null, withinMilesOfUser: null });
      setZipError(null);
      return;
    }
    const r = resolveZip(zip);
    if (!r) {
      setZipError("We couldn't find that ZIP. Try a 5-digit US code.");
      return;
    }
    setZipError(null);
    onChange({
      userZip: zip,
      userCoords: { lat: r.lat, lng: r.lng },
      withinMilesOfUser: 500,
    });
  }

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.query) n++;
    if (filters.states.length) n++;
    if (filters.rdapOnly) n++;
    if (filters.medicalOnly) n++;
    if (filters.userZip) n++;
    return n;
  }, [filters]);

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-20 w-[min(calc(100%-2rem),22rem)] rounded-2xl border border-ink/10 bg-cream-50/92 shadow-paper backdrop-blur">
      {/* Search row */}
      <div className="flex items-center gap-2 px-4 pt-3.5">
        <Icon icon={faMagnifyingGlass} className="text-ink-muted" />
        <input
          type="search"
          placeholder="Search by camp, city, or state"
          aria-label="Search facilities"
          value={queryDraft}
          onChange={(e) => setQueryDraft(e.target.value)}
          className="w-full bg-transparent text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
        />
        {queryDraft && (
          <button
            type="button"
            onClick={() => setQueryDraft('')}
            aria-label="Clear search"
            className="rounded-full p-1 text-ink-muted hover:bg-cream-100 hover:text-ink"
          >
            <Icon icon={faXmark} />
          </button>
        )}
      </div>

      {/* ZIP + filter toggle row */}
      <div className="flex items-center gap-2 px-3 pb-3 pt-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-cream px-3 py-1.5">
          <Icon icon={faLocationCrosshairs} className="text-clay text-[12px]" />
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="Your ZIP code"
            aria-label="Your ZIP code"
            value={zipInput}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 5);
              setZipInput(v);
              if (v.length === 5) applyZip(v);
              else if (v.length === 0) applyZip('');
            }}
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-muted focus:outline-none"
          />
          {filters.userZip && (
            <button
              type="button"
              onClick={() => {
                setZipInput('');
                applyZip('');
              }}
              aria-label="Clear ZIP"
              className="text-[11px] text-ink-muted hover:text-ink"
            >
              <Icon icon={faXmark} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label="More filters"
          className={cn(
            'relative grid h-9 w-9 place-items-center rounded-full border border-ink/10',
            expanded ? 'bg-clay text-cream-50' : 'bg-cream text-ink hover:bg-cream-100',
          )}
        >
          <Icon icon={faSliders} />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold text-cream-50">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {zipError && (
        <p className="px-4 pb-3 text-[11px] text-clay-deep">{zipError}</p>
      )}

      {/* Expanded filter body */}
      {expanded && (
        <div className="space-y-4 border-t border-ink/10 px-4 py-4">
          <div>
            <p className="small-caps text-[10px] text-ink-muted">Programs</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <ToggleChip
                active={filters.rdapOnly}
                onToggle={() => onChange({ rdapOnly: !filters.rdapOnly })}
                icon={faShieldHeart}
                label="RDAP"
              />
              <ToggleChip
                active={filters.medicalOnly}
                onToggle={() => onChange({ medicalOnly: !filters.medicalOnly })}
                icon={faStethoscope}
                label="Medical"
              />
            </div>
          </div>

          <div>
            <p className="small-caps text-[10px] text-ink-muted">State</p>
            <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {allStates.map((st) => {
                const active = filters.states.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() =>
                      onChange({
                        states: active
                          ? filters.states.filter((s) => s !== st)
                          : [...filters.states, st],
                      })
                    }
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                      active
                        ? 'border-clay bg-clay text-cream-50'
                        : 'border-ink/15 bg-cream text-ink-soft hover:bg-cream-100',
                    )}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setQueryDraft('');
                setZipInput('');
                onChange({
                  query: '',
                  states: [],
                  rdapOnly: false,
                  medicalOnly: false,
                  userZip: null,
                  userCoords: null,
                  withinMilesOfUser: null,
                });
              }}
              className="text-[12px] text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ToggleChip({
  active,
  onToggle,
  icon,
  label,
}: {
  active: boolean;
  onToggle: () => void;
  icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'border-clay bg-clay text-cream-50'
          : 'border-ink/15 bg-cream text-ink-soft hover:bg-cream-100',
      )}
    >
      <Icon icon={icon} />
      {label}
    </button>
  );
}
