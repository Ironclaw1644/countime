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

/**
 * Markers are double-encoded: shape carries the kind of facility, fill carries
 * its operating status, and a ring marks on-site RDAP. Colour alone was doing
 * all of that before, which broke down as soon as closures needed showing —
 * and never worked for colour-blind readers or in print.
 */
export type MarkerShape = 'camp' | 'medical' | 'holding';

export function shapeFor(f: Facility): MarkerShape {
  if (HOLDING_TYPES.includes(f.type)) return 'holding';
  if (f.type === 'FMC' || f.type === 'MCFP' || f.isMedical) return 'medical';
  return 'camp';
}

/** Geometry shared by the markers and the legend, so the two can't drift. */
export function MarkerGlyph({
  shape,
  status,
  rdap,
  women,
  size = 13,
  className,
}: {
  shape: MarkerShape;
  status: Facility['status'];
  rdap?: boolean;
  women?: boolean;
  size?: number;
  className?: string;
}) {
  const closed = status === 'CLOSED';
  const hollow = status === 'CLOSING' || status === 'CONVERTING';
  const color = closed
    ? 'var(--state-closed)'
    : women
      ? 'var(--tone-women)'
      : shape === 'medical'
        ? 'var(--tone-medical)'
        : shape === 'holding'
          ? 'var(--tone-holding)'
          : 'var(--state-open)';

  const stroke = `rgb(${color})`;
  const fill = hollow || closed ? 'transparent' : stroke;
  const box = 24;
  const c = box / 2;
  const r = 6.5;

  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      width={size * 1.85}
      height={size * 1.85}
      aria-hidden
      className={cn('overflow-visible', className)}
    >
      {rdap && !closed && (
        <circle cx={c} cy={c} r={r + 3.4} fill="none" stroke="rgb(var(--tone-rdap))" strokeWidth="1.4" />
      )}
      {shape === 'camp' && (
        <circle cx={c} cy={c} r={r} fill={fill} stroke={stroke} strokeWidth="1.8" />
      )}
      {shape === 'medical' && (
        <rect
          x={c - r} y={c - r} width={r * 2} height={r * 2} rx="1.4"
          fill={fill} stroke={stroke} strokeWidth="1.8"
        />
      )}
      {shape === 'holding' && (
        <path
          d={`M${c} ${c - r - 0.8} L${c + r + 0.8} ${c} L${c} ${c + r + 0.8} L${c - r - 0.8} ${c} Z`}
          fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinejoin="round"
        />
      )}
      {closed && (
        <path
          d={`M${c - r} ${c - r} L${c + r} ${c + r}`}
          stroke={stroke} strokeWidth="1.8" strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function FacilityMarker({
  facility,
  isSelected,
  isDimmed,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: Props) {
  const shape = shapeFor(facility);

  return (
    <Marker
      longitude={facility.lng}
      latitude={facility.lat}
      anchor="center"
      style={{ cursor: 'pointer' }}
    >
      <button
        type="button"
        aria-label={`${facility.name} in ${facility.city}, ${facility.state}${
          facility.status !== 'OPEN' ? ` — ${facility.status.toLowerCase()}` : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(facility.id);
        }}
        onMouseEnter={() => onHoverStart?.(facility.id)}
        onMouseLeave={() => onHoverEnd?.()}
        onFocus={() => onHoverStart?.(facility.id)}
        onBlur={() => onHoverEnd?.()}
        className={cn(
          'group relative grid h-7 w-7 place-items-center rounded-full transition-all duration-200',
          isDimmed && !isSelected ? 'opacity-25' : 'opacity-100',
          facility.status === 'CLOSED' && !isSelected && 'opacity-70',
          isSelected && 'z-30 scale-[1.35]',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-full bg-current opacity-0 blur-[3px] transition-opacity',
            'text-accent group-hover:opacity-20 group-focus-visible:opacity-20',
            isSelected && 'opacity-25',
          )}
        />
        <MarkerGlyph
          shape={shape}
          status={facility.status}
          rdap={facility.rdapAtFacility && facility.rdapStatus === 'ACTIVE'}
          women={facility.gender === 'FEMALE'}
          className="relative drop-shadow-sm"
        />
      </button>
    </Marker>
  );
}
