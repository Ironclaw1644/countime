export type FacilityType =
  | 'FPC'
  | 'FMC'
  | 'SCP'
  | 'FCI-CAMP'
  | 'MIN-OTHER'
  | 'MCFP'
  | 'FDC'
  | 'MCC'
  | 'MDC'
  | 'FTC';

export type SecurityLevel = 'MINIMUM' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ADMIN';

export type Gender = 'MALE' | 'FEMALE' | 'COED';

/**
 * Where a facility stands today.
 *
 * BOP closes, suspends and repurposes camps faster than most directories keep
 * up with, so this is tracked explicitly rather than by deleting rows — people
 * search for facilities by name long after they shut, and a dated explanation
 * serves them better than a missing page.
 *
 * - OPEN        operating normally
 * - CLOSING     announced for closure but still holding people
 * - CONVERTING  staying open, but changing to a security level that is no
 *               longer a camp (so a minimum-custody designation won't land here)
 * - CLOSED      no longer operating; BOP reports no population
 */
export type FacilityStatus = 'OPEN' | 'CLOSING' | 'CONVERTING' | 'CLOSED';

export type RdapStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSING';

export type Region = 'Northeast' | 'Midwest' | 'South' | 'West';

export const HOLDING_TYPES: FacilityType[] = ['FDC', 'MCC', 'MDC', 'FTC'];

/** Statuses where someone could still be designated to this facility. */
export const LIVE_STATUSES: FacilityStatus[] = ['OPEN', 'CLOSING'];

export interface CommissarySection {
  category: string;
  items: string[];
}

export interface Facility {
  /** Short identifier, e.g. 'mon', 'otv-camp'. Also the /facilities/{id} URL. */
  id: string;
  /** Display name, e.g. 'FPC Montgomery' */
  name: string;
  /** Facility classification */
  type: FacilityType;
  /** For satellite camps, the parent facility's BOP code (e.g. 'otv') */
  parentFacility?: string;
  /** Street address */
  address: string;
  city: string;
  /** Two-letter state code */
  state: string;
  zip: string;
  lat: number;
  lng: number;
  /** Main contact phone */
  phone: string;
  securityLevel: SecurityLevel;
  /** Population housed here (camp portion only, for satellite camps) */
  totalPopulation?: number;
  /** ISO date of the BOP population report `totalPopulation` came from */
  populationAsOf?: string;
  /** Who's housed here */
  gender: Gender;

  /** Operating status — see {@link FacilityStatus} */
  status: FacilityStatus;
  /** Plain-language explanation, shown whenever status isn't OPEN */
  statusNote?: string;
  /** ISO date the status took (or takes) effect */
  statusEffective?: string;
  /** The BOP page or press release the status came from */
  statusSourceUrl?: string;

  /**
   * True if BOP runs RDAP *at this facility*, per its published RDAP locations
   * list. Distinguished from {@link rdapAtComplex} because the two mean very
   * different things to someone choosing where to ask to go: RDAP can take up
   * to a year off a sentence, but you have to live in the treatment unit.
   */
  rdapAtFacility: boolean;
  /**
   * True if the parent institution runs RDAP but this camp does not — joining
   * it would mean transferring off the camp.
   */
  rdapAtComplex: boolean;
  /** Whether that program is running, suspended, or winding down */
  rdapStatus?: RdapStatus;

  /** True if this is a medical facility (FMC) or has a medical mission */
  isMedical: boolean;
  /**
   * True if this facility is a valid self-surrender destination — i.e. a
   * minimum-custody designation can land here when a court orders voluntary
   * surrender. True for operating FPCs, satellite camps, and FMCs. False for
   * holding facilities (FDC/MCC/MDC/FTC), admin-security medical (MCFP), and
   * anything closed or converting away from minimum security.
   *
   * Note: the U.S. Marshals Service ultimately tells each person where to
   * report. BOP doesn't publish a master list — this flag reflects facility
   * type and status, not a per-facility BOP designation. See
   * https://www.bop.gov/inmates/custody_and_care/voluntary_surrenders.jsp
   */
  acceptsSelfSurrender: boolean;
  /** Notable programs (UNICOR, Education, etc.) */
  programs?: string[];
  /** Items the facility's commissary sells, grouped by category */
  commissary?: CommissarySection[];
  /** Rec equipment + facility amenities */
  amenities?: string[];
  /** Education + vocational classes offered */
  classes?: string[];
  /** ISO date this facility's detail data was last reviewed */
  dataLastVerified?: string;
  /** Official BOP facility page */
  bopUrl: string;
  /**
   * A&O handbook PDF on bop.gov. Optional: BOP does not publish one for every
   * facility, and the filename pattern is inconsistent, so this is only set
   * where the URL was scraped from the institution page and verified.
   */
  handbookUrl?: string;
  /** ISO date handbookUrl was last confirmed to resolve */
  handbookCheckedAt?: string;
  /** Local mirror path served from /public, populated by fetch-handbooks script */
  handbookMirror?: string;
  /**
   * Official BOP voluntary-surrender instructions PDF for this facility,
   * if one is published. Pattern: bop.gov/locations/institutions/{prefix}/{prefix}_vol_surrender.pdf
   */
  voluntarySurrenderUrl?: string;
  /** Free-form note (e.g. "satellite camp at FCI Otisville") */
  notes?: string;
  /** US Census region for grouping */
  region: Region;
}

export interface FacilityFilters {
  query: string;
  states: string[];
  /** Show only facilities where RDAP runs on site */
  rdapOnly: boolean;
  medicalOnly: boolean;
  /** When true, only show facilities that accept self-surrender */
  selfSurrenderOnly: boolean;
  /** 'ALL' = no gender filter */
  gender: 'ALL' | 'MALE' | 'FEMALE';
  /** When false, hide pre-trial / transit holding facilities */
  showHolding: boolean;
  /** When false, hide facilities that have closed */
  showClosed: boolean;
  /** ZIP code entered by user; null = none */
  userZip: string | null;
  /** Resolved coords from userZip */
  userCoords: { lat: number; lng: number } | null;
  /** When userCoords is set, hide facilities outside this radius */
  withinMilesOfUser: number | null;
}
