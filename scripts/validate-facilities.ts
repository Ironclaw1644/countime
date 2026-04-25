/* eslint-disable no-console */
import facilities from '../data/facilities.json';
import type { Facility } from '../types/facility';

const REQUIRED: (keyof Facility)[] = [
  'id', 'name', 'type', 'address', 'city', 'state', 'zip',
  'lat', 'lng', 'phone', 'securityLevel', 'hasRDAP', 'isMedical',
  'bopUrl', 'handbookUrl', 'region',
];

const VALID_REGIONS = new Set(['Northeast', 'Midwest', 'South', 'West']);
const VALID_TYPES = new Set(['FPC', 'FMC', 'SCP', 'FCI-CAMP', 'MIN-OTHER', 'MCFP']);

let errors = 0;
const seenIds = new Set<string>();

for (const f of facilities as Facility[]) {
  const ctx = `[${f.id ?? '?'}] ${f.name ?? '?'}`;

  for (const k of REQUIRED) {
    if (f[k] === undefined || f[k] === null || f[k] === '') {
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

  if (f.lat < 24 || f.lat > 50 || f.lng < -125 || f.lng > -66) {
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
}

if (errors > 0) {
  console.error(`\n✗ ${errors} validation error(s)`);
  process.exit(1);
}
console.log(`✓ ${facilities.length} facilities validated`);
