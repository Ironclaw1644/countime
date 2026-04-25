'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  faStethoscope,
  faShieldHeart,
  faCircle,
  faChevronUp,
  faChevronDown,
  faVenus,
  faBuildingShield,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  showAllRings: boolean;
  onToggleRings: (next: boolean) => void;
  facilityCount: number;
  totalCount: number;
}

export function MapLegend({
  showAllRings,
  onToggleRings,
  facilityCount,
  totalCount,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 max-w-[280px] overflow-hidden rounded-2xl border border-ink/10 bg-cream-50/90 shadow-paper backdrop-blur">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left"
      >
        <span className="small-caps text-[10px] text-ink-muted">Legend</span>
        <Icon
          icon={open ? faChevronDown : faChevronUp}
          className="text-[10px] text-ink-muted"
        />
      </button>
      {open && (
        <div className="space-y-2.5 px-4 pb-4 text-[12px] text-ink-soft">
          <Row swatch={<Dot color="bg-clay" />} label="Federal Prison Camp" />
          <Row
            swatch={<Dot color="bg-pink" />}
            label="Women's facility"
            icon={faVenus}
          />
          <Row
            swatch={<Dot color="bg-teal" />}
            label="Medical facility (FMC / MCFP)"
            icon={faStethoscope}
          />
          <Row
            swatch={<Dot color="bg-slate" />}
            label="Holding / detention center"
            icon={faBuildingShield}
          />
          <Row
            swatch={
              <span className="grid h-4 w-4 place-items-center">
                <Icon icon={faCircle} className="text-clay text-[8px]" />
                <span
                  aria-hidden
                  className="absolute h-4 w-4 rounded-full ring-1 ring-gold"
                />
              </span>
            }
            label="Offers RDAP (drug program)"
            icon={faShieldHeart}
          />
          <hr className="border-ink/10" />
          <label className="flex cursor-pointer select-none items-center justify-between gap-2 text-[12px]">
            <span>Show all 500-mi reach</span>
            <input
              type="checkbox"
              checked={showAllRings}
              onChange={(e) => onToggleRings(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-sage-deep"
            />
          </label>
          <p className="pt-1 text-[11px] leading-snug text-ink-muted">
            Showing {facilityCount} of {totalCount} facilities. The BOP aims to
            place inmates within 500&nbsp;miles of home when possible.
          </p>
        </div>
      )}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span className={`relative inline-block h-3 w-3 rounded-full ${color}`} />
  );
}

function Row({
  swatch,
  label,
  icon,
}: {
  swatch: React.ReactNode;
  label: string;
  icon?: import('@fortawesome/fontawesome-svg-core').IconDefinition;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        {swatch}
      </span>
      <span className="flex-1">{label}</span>
      {icon && <Icon icon={icon} className="text-[11px] text-ink-muted" />}
    </div>
  );
}
