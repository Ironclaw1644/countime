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

export const HOLDING_TYPES: FacilityType[] = ['FDC', 'MCC', 'MDC', 'FTC'];

export interface CommissarySection {
  category: string;
  items: string[];
}

export interface Facility {
  /** Short identifier, e.g. 'mon', 'otv-camp' */
  id: string;
  /** Display name, e.g. 'FPC Montgomery' */
  name: string;
  /** Facility classification */
  type: FacilityType;
  /** For satellite camps, the parent facility id (e.g. 'otv') */
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
  /** Population housed at this facility (camp portion if satellite) */
  totalPopulation?: number;
  /** Who's housed here */
  gender: Gender;
  /** True if this facility offers RDAP */
  hasRDAP: boolean;
  /** True if this is a medical facility (FMC) or has a medical mission */
  isMedical: boolean;
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
  /** Primary handbook PDF URL on bop.gov */
  handbookUrl: string;
  /** Local mirror path served from /public, populated by fetch-handbooks script */
  handbookMirror?: string;
  /** Free-form note (e.g. "satellite camp at FCI Otisville") */
  notes?: string;
  /** US Census region for grouping */
  region: 'Northeast' | 'Midwest' | 'South' | 'West';
}

export interface FacilityFilters {
  query: string;
  states: string[];
  rdapOnly: boolean;
  medicalOnly: boolean;
  /** 'ALL' = no gender filter */
  gender: 'ALL' | 'MALE' | 'FEMALE';
  /** When false, hide pre-trial / transit holding facilities */
  showHolding: boolean;
  /** ZIP code entered by user; null = none */
  userZip: string | null;
  /** Resolved coords from userZip */
  userCoords: { lat: number; lng: number } | null;
  /** When userCoords is set, hide facilities outside this radius */
  withinMilesOfUser: number | null;
}
