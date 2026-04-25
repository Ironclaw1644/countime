import distance from '@turf/distance';
import { point } from '@turf/helpers';
// @ts-expect-error - zipcodes has no types but it's a tiny lookup library
import zipcodes from 'zipcodes';

export interface ZipResult {
  zip: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
}

/**
 * Resolve a US ZIP code to coordinates. Returns null if not found.
 */
export function resolveZip(zip: string): ZipResult | null {
  if (!/^\d{5}$/.test(zip)) return null;
  const result = zipcodes.lookup(zip);
  if (!result) return null;
  return {
    zip: result.zip,
    lat: result.latitude,
    lng: result.longitude,
    city: result.city,
    state: result.state,
  };
}

/**
 * Distance in miles between two lat/lng pairs (haversine).
 */
export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const from = point([a.lng, a.lat]);
  const to = point([b.lng, b.lat]);
  return distance(from, to, { units: 'miles' });
}

/**
 * Continental US bounding box. Used for sanity-checking facility coords
 * and for fitting the initial map viewport.
 */
export const US_BOUNDS = {
  west: -125,
  south: 24,
  east: -66,
  north: 50,
};

export function isInUS(lat: number, lng: number): boolean {
  return (
    lat >= US_BOUNDS.south &&
    lat <= US_BOUNDS.north &&
    lng >= US_BOUNDS.west &&
    lng <= US_BOUNDS.east
  );
}

export const DEFAULT_VIEW = {
  longitude: -96.5,
  latitude: 38.5,
  zoom: 3.6,
};
