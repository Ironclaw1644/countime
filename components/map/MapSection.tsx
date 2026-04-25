'use client';

import dynamic from 'next/dynamic';

const FacilityMap = dynamic(() => import('./FacilityMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-cream-100">
      <div className="flex flex-col items-center gap-3 text-ink-muted">
        <span
          aria-hidden
          className="h-6 w-6 animate-spin rounded-full border-2 border-clay/30 border-t-clay"
        />
        <span className="small-caps text-[11px]">Drawing the map…</span>
      </div>
    </div>
  ),
});

export function MapSection() {
  return (
    <div
      id="map"
      className="relative h-[78vh] min-h-[560px] w-full overflow-hidden border-y border-ink/10 bg-cream-100"
    >
      <FacilityMap />
    </div>
  );
}
