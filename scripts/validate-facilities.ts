/* eslint-disable no-console */
import facilities from '../data/facilities.json';
import type { Facility } from '../types/facility';

const REQUIRED: (keyof Facility)[] = [
  'id', 'name', 'type', 'address', 'city', 'state', 'zip',
  'lat', 'lng', 'phone', 'securityLevel', 'gender', 'hasRDAP', 'isMedical',
  'bopUrl', 'handbookUrl', 'region',
];

const VALID_REGIONS = new Set(['Northeast', 'Midwest', 'South', 'West']);
const VALID_TYPES = new Set([
  'FPC', 'FMC', 'SCP', 'FCI-CAMP', 'MIN-OTHER', 'MCFP',
  'FDC', 'MCC', 'MDC', 'FTC',
]);
const VALID_GENDERS = new Set(['MALE', 'FEMALE', 'COED']);
const VALID_SECURITY = new Set(['MINIMUM', 'LOW', 'MEDIUM', 'HIGH', 'ADMIN']);

let errors = 0;
const seenIds = new Set<string>();

for (const f of facilities as Facility[]) {
  const ctx = `[${f.id ?? '?'}] ${f.name ?? '?'}`;

  for (const k of REQUIRED) {
    const v = f[k];
    if (v === undefined || v === null || v === '') {
      console.error(`${ctx} → missing ${String(k)}`);
      errors++;
    }
  }

  if (seenIds.has(f.id)) {
    console.error(`${ctx} → duplicate id ${f.id}`);
    errors++;
  }
  seenIds.add(f.id);

  if (!VALID_TYPES.has(f.type)) {
    console.error(`${ctx} → invalid type ${f.type}`);
    errors++;
  }

  if (!VALID_REGIONS.has(f.region)) {
    console.error(`${ctx} → invalid region ${f.region}`);
    errors++;
  }

  if (!VALID_GENDERS.has(f.gender)) {
    console.error(`${ctx} → invalid gender ${f.gender}`);
    errors++;
  }

  if (!VALID_SECURITY.has(f.securityLevel)) {
    console.error(`${ctx} → invalid securityLevel ${f.securityLevel}`);
    errors++;
  }

  // Allow Puerto Rico (~18° lat, -66° lng), Hawaii (~21° lat, -158° lng), Alaska, etc.
  if (f.lat < 17 || f.lat > 72 || f.lng < -180 || f.lng > -64) {
    console.error(`${ctx} → coords out of US bounds: ${f.lat}, ${f.lng}`);
    errors++;
  }

  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(f.phone)) {
    console.error(`${ctx} → phone format unexpected: ${f.phone}`);
    errors++;
  }

  if (!/^https:\/\/www\.bop\.gov\//.test(f.bopUrl)) {
    console.error(`${ctx} → bopUrl not on bop.gov: ${f.bopUrl}`);
    errors++;
  }

  if (!/\.pdf$/.test(f.handbookUrl)) {
    console.error(`${ctx} → handbookUrl not a PDF: ${f.handbookUrl}`);
    errors++;
  }

  if (f.commissary) {
    for (const sec of f.commissary) {
      if (!sec.category || !Array.isArray(sec.items) || sec.items.length === 0) {
        console.error(`${ctx} → invalid commissary section ${JSON.stringify(sec)}`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n✗ ${errors} validation error(s)`);
  process.exit(1);
}
console.log(`✓ ${facilities.length} facilities validated`);
