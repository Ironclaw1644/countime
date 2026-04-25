export type FacilityType = 'FPC' | 'FMC' | 'SCP' | 'FCI-CAMP' | 'MIN-OTHER' | 'MCFP';

export type SecurityLevel = 'MINIMUM' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ADMIN';

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
  /** Approximate inmate population (camp portion if satellite) */
  totalPopulation?: number;
  /** True if this facility offers RDAP */
  hasRDAP: boolean;
  /** True if this is a medical facility (FMC) or has a medical mission */
  isMedical: boolean;
  /** Notable programs (UNICOR, Education, etc.) */
  programs?: string[];
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
  /** ZIP code entered by user; null = none */
  userZip: string | null;
  /** Resolved coords from userZip */
  userCoords: { lat: number; lng: number } | null;
  /** When userCoords is set, hide facilities outside this radius */
  withinMilesOfUser: number | null;
}
