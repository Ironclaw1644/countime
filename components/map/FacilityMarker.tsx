'use client';

import { Marker } from 'react-map-gl/maplibre';
import { cn } from '@/lib/cn';
import { HOLDING_TYPES, type Facility } from '@/types/facility';

interface Props {
  facility: Facility;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (id: string) => void;
  onHoverStart?: (id: string) => void;
  onHoverEnd?: () => void;
}

type Variant = 'pink' | 'slate' | 'teal' | 'clay';

function variantFor(facility: Facility): Variant {
  if (facility.gender === 'FEMALE') return 'pink';
  if (HOLDING_TYPES.includes(facility.type)) return 'slate';
  if (facility.type === 'FMC' || facility.type === 'MCFP' || facility.isMedical) return 'teal';
  return 'clay';
}

const HALO: Record<Variant, string> = {
  pink: 'bg-pink/40',
  slate: 'bg-slate/40',
  teal: 'bg-teal/40',
  clay: 'bg-clay/40',
};

const DOT: Record<Variant, string> = {
  pink: 'bg-pink',
  slate: 'bg-slate',
  teal: 'bg-teal',
  clay: 'bg-clay',
};

const DOT_SELECTED: Record<Variant, string> = {
  pink: 'bg-pink-deep',
  slate: 'bg-slate-deep',
  teal: 'bg-teal-deep',
  clay: 'bg-clay-deep',
};

export function FacilityMarker({
  facility,
  isSelected,
  isDimmed,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: Props) {
  const variant = variantFor(facility);

  return (
    <Marker
      longitude={facility.lng}
      latitude={facility.lat}
      anchor="center"
      style={{ cursor: 'pointer' }}
    >
      <button
        type="button"
        aria-label={`${facility.name} in ${facility.city}, ${facility.state}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(facility.id);
        }}
        onMouseEnter={() => onHoverStart?.(facility.id)}
        onMouseLeave={() => onHoverEnd?.()}
        onFocus={() => onHoverStart?.(facility.id)}
        onBlur={() => onHoverEnd?.()}
        className={cn(
          'group relative grid place-items-center',
          'h-7 w-7 rounded-full',
          'transition-all duration-200',
          isDimmed && !isSelected ? 'opacity-30' : 'opacity-100',
          isSelected && 'scale-125 z-30',
        )}
      >
        {/* Soft pulse halo */}
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-full',
            HALO[variant],
            'animate-pulse-soft',
            !isSelected && 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
          )}
        />
        {/* Gold RDAP ring */}
        {facility.hasRDAP && (
          <span
            aria-hidden
            className={cn(
              'absolute inset-0 rounded-full ring-2 ring-gold ring-offset-2 ring-offset-cream-50',
            )}
          />
        )}
        {/* Core dot */}
        <span
          aria-hidden
          className={cn(
            'block h-3.5 w-3.5 rounded-full border-[2px] border-cream-50 shadow-paper',
            isSelected ? DOT_SELECTED[variant] : DOT[variant],
          )}
        />
      </button>
    </Marker>
  );
}
