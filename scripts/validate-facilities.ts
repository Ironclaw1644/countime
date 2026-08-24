 
import facilities from '../data/facilities.json';
import type { Facility } from '../types/facility';

const REQUIRED: (keyof Facility)[] = [
  'id', 'name', 'type', 'address', 'city', 'state', 'zip',
  'lat', 'lng', 'phone', 'securityLevel', 'gender', 'isMedical',
  'status', 'rdapAtFacility', 'rdapAtComplex',
  'acceptsSelfSurrender',
  'bopUrl', 'region',
];

const VALID_REGIONS = new Set(['Northeast', 'Midwest', 'South', 'West']);
const VALID_TYPES = new Set([
  'FPC', 'FMC', 'SCP', 'FCI-CAMP', 'MIN-OTHER', 'MCFP',
  'FDC', 'MCC', 'MDC', 'FTC',
]);
const VALID_GENDERS = new Set(['MALE', 'FEMALE', 'COED']);
const VALID_SECURITY = new Set(['MINIMUM', 'LOW', 'MEDIUM', 'HIGH', 'ADMIN']);
const VALID_STATUS = new Set(['OPEN', 'CLOSING', 'CONVERTING', 'CLOSED']);
const VALID_RDAP_STATUS = new Set(['ACTIVE', 'SUSPENDED', 'CLOSING']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

let errors = 0;
let warnings = 0;
const seenIds = new Set<string>();
const fail = (ctx: string, msg: string) => { console.error(`${ctx} → ${msg}`); errors++; };
const warn = (ctx: string, msg: string) => { console.warn(`${ctx} ⚠ ${msg}`); warnings++; };

for (const f of facilities as Facility[]) {
  const ctx = `[${f.id ?? '?'}] ${f.name ?? '?'}`;

  for (const k of REQUIRED) {
    const v = f[k];
    if (v === undefined || v === null || v === '') fail(ctx, `missing ${String(k)}`);
  }

  if (seenIds.has(f.id)) fail(ctx, `duplicate id ${f.id}`);
  seenIds.add(f.id);

  if (!VALID_TYPES.has(f.type)) fail(ctx, `invalid type ${f.type}`);
  if (!VALID_REGIONS.has(f.region)) fail(ctx, `invalid region ${f.region}`);
  if (!VALID_GENDERS.has(f.gender)) fail(ctx, `invalid gender ${f.gender}`);
  if (!VALID_SECURITY.has(f.securityLevel)) fail(ctx, `invalid securityLevel ${f.securityLevel}`);
  if (!VALID_STATUS.has(f.status)) fail(ctx, `invalid status ${f.status}`);

  // Anything not OPEN has to explain itself — an unlabelled closure is worse
  // than no entry, because it reads as a live option.
  if (f.status !== 'OPEN') {
    if (!f.statusNote) fail(ctx, `status ${f.status} without statusNote`);
    if (!f.statusSourceUrl) fail(ctx, `status ${f.status} without statusSourceUrl`);
    if (f.statusEffective && !ISO_DATE.test(f.statusEffective)) {
      fail(ctx, `statusEffective not ISO date: ${f.statusEffective}`);
    }
  }

  if (f.status === 'CLOSED') {
    if (f.acceptsSelfSurrender) fail(ctx, 'closed but acceptsSelfSurrender is true');
    if (f.totalPopulation) fail(ctx, 'closed but still reports a population');
  }

  if (f.rdapStatus && !VALID_RDAP_STATUS.has(f.rdapStatus)) {
    fail(ctx, `invalid rdapStatus ${f.rdapStatus}`);
  }
  if ((f.rdapAtFacility || f.rdapAtComplex) && !f.rdapStatus) {
    fail(ctx, 'has RDAP but no rdapStatus');
  }
  if (f.rdapAtFacility && f.rdapAtComplex) {
    fail(ctx, 'rdapAtFacility and rdapAtComplex are both true — pick one');
  }
  if (f.programs?.some((p) => p.toUpperCase() === 'RDAP') && !f.rdapAtFacility && !f.rdapAtComplex) {
    fail(ctx, 'programs lists RDAP but both RDAP flags are false');
  }

  // Allow Puerto Rico (~18° lat, -66° lng), Hawaii (~21° lat, -158° lng), Alaska, etc.
  if (f.lat < 17 || f.lat > 72 || f.lng < -180 || f.lng > -64) {
    fail(ctx, `coords out of US bounds: ${f.lat}, ${f.lng}`);
  }

  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(f.phone)) fail(ctx, `phone format unexpected: ${f.phone}`);
  if (!/^https:\/\/www\.bop\.gov\//.test(f.bopUrl)) fail(ctx, `bopUrl not on bop.gov: ${f.bopUrl}`);

  // handbookUrl is optional — BOP doesn't publish one everywhere — but if it's
  // set it must be a PDF, since the UI offers it as a download.
  if (f.handbookUrl && !/\.pdf$/.test(f.handbookUrl)) {
    fail(ctx, `handbookUrl not a PDF: ${f.handbookUrl}`);
  }
  if (!f.handbookUrl && f.status !== 'CLOSED') {
    warn(ctx, 'no A&O handbook published by BOP');
  }

  if (f.totalPopulation && !f.populationAsOf) warn(ctx, 'population without populationAsOf');

  if (f.commissary) {
    for (const sec of f.commissary) {
      if (!sec.category || !Array.isArray(sec.items) || sec.items.length === 0) {
        fail(ctx, `invalid commissary section ${JSON.stringify(sec)}`);
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n✗ ${errors} validation error(s), ${warnings} warning(s)`);
  process.exit(1);
}
console.log(`✓ ${facilities.length} facilities validated (${warnings} warning(s))`);
