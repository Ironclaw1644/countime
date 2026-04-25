'use client';

import { Popup } from 'react-map-gl/maplibre';
import { Icon } from '@/components/ui/Icon';
import {
  faPhone,
  faLocationDot,
  faDownload,
  faShieldHeart,
  faStethoscope,
  faArrowUpRightFromSquare,
  faRoad,
} from '@fortawesome/free-solid-svg-icons';
import type { Facility } from '@/types/facility';

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
};

export function FacilityTooltip({ facility, distanceMiles, onClose }: Props) {
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
            <p className="small-caps text-[10px] text-ink-muted">
              {TYPE_LABEL[facility.type]}
            </p>
            <h3 className="font-display text-xl leading-tight tracking-tightest text-ink">
              {facility.name}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-muted hover:bg-cream-100 hover:text-ink"
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
            <Icon icon={faLocationDot} className="mt-0.5 text-clay" />
            <span>
              {facility.address}
              <br />
              {facility.city}, {facility.state} {facility.zip}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Icon icon={faPhone} className="text-clay" />
            <a
              href={`tel:${facility.phone.replace(/\D/g, '')}`}
              className="hover:text-clay-deep"
            >
              {facility.phone}
            </a>
          </p>
          {distanceMiles != null && (
            <p className="flex items-center gap-2">
              <Icon icon={faRoad} className="text-clay" />
              <span>
                <strong className="font-semibold text-ink">
                  {Math.round(distanceMiles)} miles
                </strong>{' '}
                from your home ZIP
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {facility.isMedical && (
            <Chip icon={faStethoscope} tone="teal">
              Medical
            </Chip>
          )}
          {facility.hasRDAP && (
            <Chip icon={faShieldHeart} tone="gold">
              RDAP
            </Chip>
          )}
          {facility.totalPopulation && (
            <Chip>~{facility.totalPopulation} inmates</Chip>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <a
            href={facility.handbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-4 py-2 text-[13px] font-medium text-cream-50 transition-colors hover:bg-clay-deep"
          >
            <Icon icon={faDownload} />
            A&amp;O Handbook
          </a>
          <a
            href={facility.bopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-2 text-[12px] text-ink-soft hover:text-clay-deep"
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
  tone?: 'sage' | 'gold' | 'teal';
}) {
  const tones = {
    sage: 'bg-sage/15 text-sage-deep',
    gold: 'bg-gold/20 text-gold-deep',
    teal: 'bg-teal/15 text-teal-deep',
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
