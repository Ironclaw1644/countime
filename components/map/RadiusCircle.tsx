'use client';

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import circle from '@turf/circle';
import { point } from '@turf/helpers';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { Facility } from '@/types/facility';

interface Props {
  /** Facilities whose 500mi rings should be shown */
  facilities: Facility[];
  /** Optional user origin (from ZIP) for a single emphasized ring */
  userOrigin?: { lat: number; lng: number } | null;
  radiusMiles?: number;
  /** Render facility rings dimmed (background reference) vs prominent */
  dimFacilityRings?: boolean;
}

const STEPS = 96;

function makeCircle(lng: number, lat: number, miles: number, id: string): Feature<Polygon> {
  return circle(point([lng, lat]), miles, { steps: STEPS, units: 'miles', properties: { id } });
}

export function RadiusCircle({
  facilities,
  userOrigin,
  radiusMiles = 500,
  dimFacilityRings = false,
}: Props) {
  const facilityRings: FeatureCollection<Polygon> = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: facilities.map((f) => makeCircle(f.lng, f.lat, radiusMiles, f.id)),
    }),
    [facilities, radiusMiles],
  );

  const userRing: FeatureCollection<Polygon> | null = useMemo(() => {
    if (!userOrigin) return null;
    return {
      type: 'FeatureCollection',
      features: [makeCircle(userOrigin.lng, userOrigin.lat, radiusMiles, 'user')],
    };
  }, [userOrigin, radiusMiles]);

  return (
    <>
      {facilities.length > 0 && (
        <Source id="facility-rings" type="geojson" data={facilityRings}>
          <Layer
            id="facility-rings-fill"
            type="fill"
            paint={{
              'fill-color': '#7B8F7A',
              'fill-opacity': dimFacilityRings ? 0.04 : 0.08,
            }}
          />
          <Layer
            id="facility-rings-stroke"
            type="line"
            paint={{
              'line-color': '#5C7059',
              'line-width': dimFacilityRings ? 0.6 : 1,
              'line-opacity': dimFacilityRings ? 0.18 : 0.45,
              'line-dasharray': [3, 2],
            }}
          />
        </Source>
      )}
      {userRing && (
        <Source id="user-ring" type="geojson" data={userRing}>
          <Layer
            id="user-ring-fill"
            type="fill"
            paint={{
              'fill-color': '#C97B5B',
              'fill-opacity': 0.1,
            }}
          />
          <Layer
            id="user-ring-stroke"
            type="line"
            paint={{
              'line-color': '#A55E3F',
              'line-width': 1.6,
              'line-opacity': 0.8,
            }}
          />
        </Source>
      )}
    </>
  );
}
