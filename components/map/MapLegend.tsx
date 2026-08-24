'use client';

import { useState } from 'react';
import { MarkerGlyph } from './FacilityMarker';

interface Props {
  showAllRings: boolean;
  onToggleRings: (next: boolean) => void;
  facilityCount: number;
  totalCount: number;
}

/**
 * Teaches the marker encoding. Every swatch is drawn with the same
 * <MarkerGlyph> the map uses, so the legend cannot fall out of step with what
 * is actually on screen.
 */
export function MapLegend({
  showAllRings,
  onToggleRings,
  facilityCount,
  totalCount,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 w-[264px] overflow-hidden rounded border border-rule bg-paper-raised/95 shadow-raise backdrop-blur">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left"
      >
        <span className="eyebrow">Legend</span>
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink-muted" stroke="currentColor" strokeWidth="1.3" fill="none">
          <path d={open ? 'M2.5 7.5 6 4l3.5 3.5' : 'M2.5 4.5 6 8l3.5-3.5'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-rule px-4 pb-4 pt-3">
          <p className="eyebrow mb-2 !tracking-[0.1em]">Shape — what kind</p>
          <ul className="space-y-1.5">
            <Row glyph={<MarkerGlyph shape="camp" status="OPEN" size={9} />} label="Minimum-security camp" />
            <Row glyph={<MarkerGlyph shape="medical" status="OPEN" size={9} />} label="Federal medical center" />
            <Row glyph={<MarkerGlyph shape="holding" status="OPEN" size={9} />} label="Holding / detention" />
            <Row glyph={<MarkerGlyph shape="camp" status="OPEN" size={9} women />} label="Women&rsquo;s facility" />
          </ul>

          <p className="eyebrow mb-2 mt-4 !tracking-[0.1em]">Fill — what state</p>
          <ul className="space-y-1.5">
            <Row glyph={<MarkerGlyph shape="camp" status="OPEN" size={9} />} label="Open" />
            <Row glyph={<MarkerGlyph shape="camp" status="CLOSING" size={9} />} label="Closing or converting" />
            <Row glyph={<MarkerGlyph shape="camp" status="CLOSED" size={9} />} label="Closed" />
            <Row glyph={<MarkerGlyph shape="camp" status="OPEN" size={9} rdap />} label="RDAP on site" />
          </ul>

          <label className="mt-4 flex cursor-pointer items-center gap-2 border-t border-rule pt-3 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={showAllRings}
              onChange={(e) => onToggleRings(e.target.checked)}
              className="h-3.5 w-3.5 accent-[rgb(var(--accent))]"
            />
            Show all 500-mile reach
          </label>

          <p className="mt-3 text-2xs leading-relaxed text-ink-muted">
            Showing <span className="tabular text-ink-soft">{facilityCount}</span> of{' '}
            <span className="tabular text-ink-soft">{totalCount}</span>. The Bureau aims to
            place people within 500 miles of home when it can.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ glyph, label }: { glyph: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-xs text-ink-soft">
      <span className="grid h-4 w-4 shrink-0 place-items-center">{glyph}</span>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </li>
  );
}
