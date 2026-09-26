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

/**
 * The prison a camp sits beside, ready to display.
 *
 * Countime only carries camp pages, so for all but a couple of camps the
 * parent institution has no page here — linking to `/facilities/<parent>`
 * sent 62 of 64 camp pages to a 404. When the parent is one of the few we do
 * carry, link inside; otherwise show its name and point at the Bureau's own
 * page for it, which is what `bopUrl` already is.
 *
 * Every camp in the data is named "<parent> Camp", so the parent's name comes
 * off the camp's own name rather than being guessed.
 */
export function parentFacilityLink(
  f: Facility,
): { name: string; href: string; external: boolean } | null {
  if (!f.parentFacility) return null;

  const onSite = getFacilityById(f.parentFacility);
  if (onSite) return { name: onSite.name, href: `/facilities/${onSite.id}`, external: false };

  const name = f.name.replace(/ Camp$/, '');
  if (name === f.name || !f.bopUrl) return null;
  return { name, href: f.bopUrl, external: true };
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

export const TYPE_LABEL: Record<Facility['type'], string> = {
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

export const STATE_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', PR: 'Puerto Rico', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

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
