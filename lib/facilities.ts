import facilitiesJson from '@/data/facilities.json';
import {
  HOLDING_TYPES,
  type Facility,
  type FacilityFilters,
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
    out = out.filter((f) => f.hasRDAP);
  }

  if (filters.medicalOnly) {
    out = out.filter((f) => f.isMedical);
  }

  if (filters.gender !== 'ALL') {
    out = out.filter((f) => f.gender === filters.gender);
  }

  if (!filters.showHolding) {
    out = out.filter((f) => !isHoldingFacility(f));
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
  gender: 'ALL',
  showHolding: true,
  userZip: null,
  userCoords: null,
  withinMilesOfUser: null,
};
