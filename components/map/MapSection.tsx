'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

const FacilityMap = dynamic(() => import('./FacilityMap'), {
  ssr: false,
  loading: () => <MapPlaceholder label="Drawing the map…" spinning />,
});

/**
 * The facility map, loaded only as it approaches the viewport.
 *
 * MapLibre is by far the heaviest thing on the site (about 1.5 s of main-thread
 * work on a mid-range phone in the 2026-09 Lighthouse baseline). On the home
 * page it sits below the fold, so there is no reason to pay for it before the
 * reader scrolls towards it. `eager` skips the wait where the map *is* the page.
 */
export function MapSection({ eager = false, className }: { eager?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(eager);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <div
      id="map"
      ref={ref}
      className={cn(
        'relative h-[78vh] min-h-[560px] w-full scroll-mt-16 overflow-hidden border-y border-rule bg-paper-sunk',
        className,
      )}
    >
      {near ? <FacilityMap /> : <MapPlaceholder label="The map loads as you scroll to it" />}
    </div>
  );
}

function MapPlaceholder({ label, spinning = false }: { label: string; spinning?: boolean }) {
  return (
    <div className="grid h-full place-items-center bg-paper-sunk">
      <div className="flex flex-col items-center gap-3 text-ink-muted">
        {spinning && (
          <span
            aria-hidden
            className="h-6 w-6 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
          />
        )}
        <span className="eyebrow">{label}</span>
      </div>
    </div>
  );
}
