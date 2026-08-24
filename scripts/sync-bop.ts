 
/**
 * Reconciles data/facilities.json against the Bureau of Prisons' own public
 * endpoints and reports every disagreement.
 *
 * This exists because the previous dataset rotted silently: six entries were
 * for camps that no longer existed, thirty-three camps were missing outright,
 * a third of the coordinates were more than a mile off, and most handbook
 * links 404'd. None of that was detectable without a check like this one.
 *
 * Run with `npm run validate:facilities`, or on its own:
 *   npx tsx scripts/sync-bop.ts          # report drift
 *   npx tsx scripts/sync-bop.ts --links  # also HEAD every handbook URL (slow)
 */
import facilities from '../data/facilities.json';
import type { Facility } from '../types/facility';

const LOCATIONS_URL =
  'https://www.bop.gov/PublicInfo/execute/locations?todo=query&output=json';
const POPULATION_URL =
  'https://www.bop.gov/PublicInfo/execute/popreport?todo=query&output=json';

/** How far a pin may sit from BOP's own coordinate before we complain. */
const COORD_TOLERANCE_MILES = 1;
/** How stale a population figure may be, proportionally, before we complain. */
const POPULATION_TOLERANCE = 0.25;

interface BopLocation {
  code: string;
  nameDisplay: string;
  type: string;
  securityLevel: string;
  latitude: string;
  longitude: string;
  state: string;
  locationtype: string;
  hasCamp?: boolean;
}
interface PopRow {
  code: string;
  Name: string;
  popCount: number;
}

function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function bopCodeOf(f: Facility): string | null {
  const m = /\/institutions\/([a-z0-9]+)\//.exec(f.bopUrl);
  return m ? m[1].toUpperCase() : null;
}

/** A camp's own row, as opposed to its parent institution's. */
function isCampRow(name: string): boolean {
  const n = name.toUpperCase();
  return n.includes('CAMP') || n.endsWith('FPC');
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': 'countime-sync/1.0' } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function main() {
  const checkLinks = process.argv.includes('--links');
  const data = facilities as Facility[];

  console.log(`Reconciling ${data.length} facilities against bop.gov…\n`);

  const [locJson, popJson] = await Promise.all([
    getJson<{ Locations: BopLocation[] }>(LOCATIONS_URL),
    getJson<{ BOP: PopRow[]; DATEMODIFIED: string }>(POPULATION_URL),
  ]);

  const institutions = new Map<string, BopLocation>();
  for (const l of locJson.Locations) {
    if (l.locationtype === 'inst') institutions.set(l.code, l);
  }

  const campPop = new Map<string, number>();
  const mainPop = new Map<string, number>();
  for (const r of popJson.BOP) {
    const target = isCampRow(r.Name) ? campPop : mainPop;
    target.set(r.code, (target.get(r.code) ?? 0) + r.popCount);
  }

  const problems: string[] = [];
  const notes: string[] = [];
  const flag = (id: string, msg: string) => problems.push(`  ✗ [${id}] ${msg}`);
  const note = (id: string, msg: string) => notes.push(`  · [${id}] ${msg}`);

  for (const f of data) {
    const code = bopCodeOf(f);
    if (!code) {
      flag(f.id, `bopUrl has no institution code: ${f.bopUrl}`);
      continue;
    }

    const inst = institutions.get(code);
    const isCamp = f.type === 'SCP' || f.type === 'FPC';
    const pop = isCamp ? campPop.get(code) : mainPop.get(code);

    // Gone from BOP's directory entirely.
    if (!inst) {
      if (f.status !== 'CLOSED') {
        flag(f.id, `not in BOP's facility directory but status is ${f.status}`);
      } else {
        note(f.id, 'absent from BOP directory, marked CLOSED — as expected');
      }
      continue;
    }

    // A camp with no population row has stopped operating as a camp.
    if (isCamp && pop === undefined) {
      if (f.status === 'OPEN') {
        flag(f.id, 'BOP reports no camp population here, but status is OPEN');
      } else {
        note(f.id, `no camp population reported; status is ${f.status}`);
      }
    }
    if (isCamp && pop !== undefined && f.status === 'CLOSED') {
      flag(f.id, `marked CLOSED but BOP still reports ${pop} people`);
    }

    // Coordinates.
    const bopPoint = { lat: Number(inst.latitude), lng: Number(inst.longitude) };
    const drift = milesBetween(f, bopPoint);
    if (drift > COORD_TOLERANCE_MILES) {
      flag(
        f.id,
        `pin is ${drift.toFixed(1)} mi from BOP's coordinate ` +
          `(${f.lat}, ${f.lng} vs ${bopPoint.lat}, ${bopPoint.lng})`,
      );
    }

    // Population.
    if (pop !== undefined && f.totalPopulation) {
      const delta = Math.abs(pop - f.totalPopulation) / pop;
      if (delta > POPULATION_TOLERANCE) {
        flag(
          f.id,
          `population ${f.totalPopulation} vs BOP's ${pop} ` +
            `(${(delta * 100).toFixed(0)}% off, BOP data of ${popJson.DATEMODIFIED})`,
        );
      }
    }
  }

  // Camps BOP reports that this site does not list at all.
  const knownCodes = new Set(data.map(bopCodeOf).filter(Boolean));
  for (const [code, count] of campPop) {
    if (!knownCodes.has(code)) {
      const inst = institutions.get(code);
      flag(code, `BOP reports a camp of ${count} at ${inst?.nameDisplay ?? code} — not on this site`);
    }
  }

  if (checkLinks) {
    console.log('Checking handbook links…');
    const withHandbook = data.filter((f) => f.handbookUrl);
    const results = await Promise.all(
      withHandbook.map(async (f) => {
        try {
          const res = await fetch(f.handbookUrl!, { method: 'HEAD' });
          const ct = res.headers.get('content-type') ?? '';
          return { f, ok: res.ok && ct.includes('pdf'), status: res.status };
        } catch {
          return { f, ok: false, status: 0 };
        }
      }),
    );
    for (const r of results) {
      if (!r.ok) flag(r.f.id, `handbook link is dead (HTTP ${r.status}): ${r.f.handbookUrl}`);
    }
  }

  console.log(`BOP population report dated ${popJson.DATEMODIFIED}.`);
  console.log(
    `BOP lists ${institutions.size} institutions and ${campPop.size} camp populations.\n`,
  );

  if (notes.length) {
    console.log(`Expected differences (${notes.length}):`);
    notes.forEach((n) => console.log(n));
    console.log('');
  }

  if (problems.length) {
    console.error(`Drift from BOP (${problems.length}):`);
    problems.forEach((p) => console.error(p));
    console.error(
      '\n✗ data/facilities.json disagrees with bop.gov. Update the data, or ' +
        'record a status + statusNote explaining why the difference is intended.',
    );
    process.exit(1);
  }

  console.log('✓ facilities.json agrees with bop.gov');
}

main().catch((err) => {
  console.error('sync-bop failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
