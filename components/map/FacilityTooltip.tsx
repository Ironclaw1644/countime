'use client';

import { Popup } from 'react-map-gl/maplibre';
import Link from 'next/link';
import { STATUS_LABEL } from '@/lib/facilities';
import { Icon } from '@/components/ui/Icon';
import {
  faPhone,
  faLocationDot,
  faDownload,
  faShieldHeart,
  faStethoscope,
  faArrowUpRightFromSquare,
  faArrowRight,
  faRoad,
  faVenus,
  faBuildingShield,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { HOLDING_TYPES, type Facility } from '@/types/facility';

interface Props {
  facility: Facility;
  /** Distance in miles from user's home, if a ZIP was entered */
  distanceMiles?: number | null;
  onClose: () => void;
}

const TYPE_LABEL: Record<Facility['type'], string> = {
  FPC: 'Federal Prison Camp',
  SCP: 'Satellite Prison Camp',
  FMC: 'Federal Medical Center',
  MCFP: 'Medical Center for Federal Prisoners',
  'FCI-CAMP': 'FCI Camp',
  'MIN-OTHER': 'Minimum-security Facility',
  FDC: 'Federal Detention Center',
  MCC: 'Metropolitan Correctional Center',
  MDC: 'Metropolitan Detention Center',
  FTC: 'Federal Transfer Center',
};

export function FacilityTooltip({ facility, distanceMiles, onClose }: Props) {
  const isHolding = HOLDING_TYPES.includes(facility.type);

  return (
    <Popup
      longitude={facility.lng}
      latitude={facility.lat}
      anchor="bottom"
      offset={20}
      closeOnClick={false}
      onClose={onClose}
      closeButton={false}
      maxWidth="340px"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-[10px] text-ink-muted">
              {TYPE_LABEL[facility.type]}
            </p>
            <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">
              {facility.name}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-muted hover:bg-paper-sunk hover:text-ink"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M2 2 L12 12 M12 2 L2 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-1.5 text-[13px] text-ink-soft">
          <p className="flex items-start gap-2">
            <Icon icon={faLocationDot} className="mt-0.5 text-accent" />
            <span>
              {facility.address}
              <br />
              {facility.city}, {facility.state} {facility.zip}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Icon icon={faPhone} className="text-accent" />
            <a
              href={`tel:${facility.phone.replace(/\D/g, '')}`}
              className="hover:text-accent-hover"
            >
              {facility.phone}
            </a>
          </p>
          {distanceMiles != null && (
            <p className="flex items-center gap-2">
              <Icon icon={faRoad} className="text-accent" />
              <span>
                <strong className="font-semibold text-ink">
                  {Math.round(distanceMiles)} miles
                </strong>{' '}
                from your home ZIP
              </span>
            </p>
          )}
        </div>

        {facility.status !== 'OPEN' && (
          <div
            className={`rounded border px-3 py-2 text-[12px] leading-relaxed ${
              facility.status === 'CLOSED'
                ? 'border-state-closed/40 text-ink-muted'
                : 'border-state-warn/45 text-ink-soft'
            }`}
          >
            <span
              className={`mr-1.5 font-semibold uppercase tracking-[0.08em] ${
                facility.status === 'CLOSED' ? 'text-state-closed' : 'text-state-warn'
              }`}
            >
              {STATUS_LABEL[facility.status]}
              {facility.statusEffective
                ? ` · ${new Date(facility.statusEffective).getUTCFullYear()}`
                : ''}
            </span>
            {facility.statusNote}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {facility.gender === 'FEMALE' && (
            <Chip icon={faVenus} tone="pink">
              Women&rsquo;s
            </Chip>
          )}
          {facility.gender === 'COED' && <Chip>Coed</Chip>}
          {isHolding && (
            <Chip icon={faBuildingShield} tone="slate">
              Holding
            </Chip>
          )}
          {facility.acceptsSelfSurrender && (
            <Chip icon={faRightToBracket} tone="sage">
              Self-surrender
            </Chip>
          )}
          {facility.isMedical && (
            <Chip icon={faStethoscope} tone="teal">
              Medical
            </Chip>
          )}
          {facility.rdapAtFacility && (
            <Chip icon={faShieldHeart} tone="gold">
              RDAP on site
            </Chip>
          )}
          {!facility.rdapAtFacility && facility.rdapAtComplex && (
            <Chip icon={faShieldHeart}>RDAP at parent prison</Chip>
          )}
          {facility.totalPopulation && (
            <Chip>~{facility.totalPopulation} inmates</Chip>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link
            href={`/facilities/${facility.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-accent-on transition-colors hover:bg-accent-hover"
          >
            View full profile
            <Icon icon={faArrowRight} className="text-[11px]" />
          </Link>
          {facility.handbookUrl && (
            <a
              href={facility.handbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-2 text-[12px] text-ink-soft hover:text-accent-hover"
            >
              <Icon icon={faDownload} />
              Handbook
            </a>
          )}
          <a
            href={facility.bopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-2 text-[12px] text-ink-soft hover:text-accent-hover"
          >
            BOP page
            <Icon icon={faArrowUpRightFromSquare} className="text-[10px]" />
          </a>
        </div>
      </div>
    </Popup>
  );
}

function Chip({
  children,
  icon,
  tone = 'sage',
}: {
  children: React.ReactNode;
  icon?: import('@fortawesome/fontawesome-svg-core').IconDefinition;
  tone?: 'sage' | 'gold' | 'teal' | 'pink' | 'slate';
}) {
  const tones = {
    sage: 'bg-accent/15 text-accent',
    gold: 'bg-tone-rdap/20 text-tone-rdap',
    teal: 'bg-tone-medical/15 text-tone-medical',
    pink: 'bg-tone-women/20 text-tone-women',
    slate: 'bg-tone-holding/15 text-tone-holding',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {icon && <Icon icon={icon} className="text-[10px]" />}
      {children}
    </span>
  );
}
