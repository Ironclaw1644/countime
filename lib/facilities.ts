import facilitiesJson from '@/data/facilities.json';
import {
  HOLDING_TYPES,
  LIVE_STATUSES,
  type Facility,
  type FacilityFilters,
  type FacilityStatus,
} from '@/types/facility';
import { distanceMiles } from './geo';

const FACILITIES = facilitiesJson as Facility[];

export function getAllFacilities(): Facility[] {
  return FACILITIES;
}

export function getFacilityById(id: string): Facility | undefined {
  return FACILITIES.find((f) => f.id === id);
}

export function isHoldingFacility(f: Facility): boolean {
  return HOLDING_TYPES.includes(f.type);
}

/** Closed facilities are kept in the data so their pages still answer searches. */
export function isClosed(f: Facility): boolean {
  return f.status === 'CLOSED';
}

/** Somewhere a person could still be designated to today. */
export function isLive(f: Facility): boolean {
  return LIVE_STATUSES.includes(f.status);
}

/**
 * Whether RDAP is reachable at all from this facility — on site, or at the
 * parent institution. Prefer the specific flags when the difference matters;
 * `rdapAtComplex` means transferring off the camp to join.
 */
export function hasAnyRdap(f: Facility): boolean {
  return f.rdapAtFacility || f.rdapAtComplex;
}

export const STATUS_LABEL: Record<FacilityStatus, string> = {
  OPEN: 'Open',
  CLOSING: 'Closing',
  CONVERTING: 'Changing security level',
  CLOSED: 'Closed',
};

export const ALL_STATES: string[] = Array.from(
  new Set(FACILITIES.map((f) => f.state)),
).sort();

export function applyFilters(facilities: Facility[], filters: FacilityFilters): Facility[] {
  let out = facilities;

  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    out = out.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.state.toLowerCase().includes(q),
    );
  }

  if (filters.states.length > 0) {
    out = out.filter((f) => filters.states.includes(f.state));
  }

  if (filters.rdapOnly) {
    out = out.filter((f) => f.rdapAtFacility);
  }

  if (filters.medicalOnly) {
    out = out.filter((f) => f.isMedical);
  }

  if (filters.selfSurrenderOnly) {
    out = out.filter((f) => f.acceptsSelfSurrender);
  }

  if (filters.gender !== 'ALL') {
    out = out.filter((f) => f.gender === filters.gender);
  }

  if (!filters.showHolding) {
    out = out.filter((f) => !isHoldingFacility(f));
  }

  if (!filters.showClosed) {
    out = out.filter((f) => !isClosed(f));
  }

  if (filters.userCoords && filters.withinMilesOfUser) {
    const limit = filters.withinMilesOfUser;
    out = out.filter((f) => distanceMiles(filters.userCoords!, f) <= limit);
  }

  return out;
}

export const initialFilters: FacilityFilters = {
  query: '',
  states: [],
  rdapOnly: false,
  medicalOnly: false,
  selfSurrenderOnly: false,
  gender: 'ALL',
  showHolding: true,
  showClosed: false,
  userZip: null,
  userCoords: null,
  withinMilesOfUser: null,
};
