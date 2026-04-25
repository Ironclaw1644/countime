/* eslint-disable no-console */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import facilities from '../data/facilities.json';
import type { Facility } from '../types/facility';

const ROOT = dirname(new URL(import.meta.url).pathname);
const PUBLIC_DIR = join(ROOT, '..', 'public', 'handbooks');
const DATA_FILE = join(ROOT, '..', 'data', 'facilities.json');

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const updated: Facility[] = [];
  let ok = 0;
  let failed = 0;

  for (const f of facilities as Facility[]) {
    const targetName = `${f.id}_ao-handbook.pdf`;
    const targetPath = join(PUBLIC_DIR, targetName);
    const mirror = `/handbooks/${targetName}`;

    try {
      const res = await fetch(f.handbookUrl, { redirect: 'follow' });
      if (!res.ok) {
        console.warn(`✗ ${f.id} HTTP ${res.status} (${f.handbookUrl})`);
        failed++;
        updated.push(f);
        continue;
      }
      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('pdf')) {
        console.warn(`✗ ${f.id} not a PDF (content-type: ${ct})`);
        failed++;
        updated.push(f);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(targetPath, buf);
      console.log(`✓ ${f.id} → ${mirror} (${(buf.byteLength / 1024).toFixed(0)} KB)`);
      ok++;
      updated.push({ ...f, handbookMirror: mirror });
    } catch (err) {
      console.warn(`✗ ${f.id} ${(err as Error).message}`);
      failed++;
      updated.push(f);
    }
  }

  // Pretty-print JSON, preserving order.
  const json = JSON.stringify(updated, null, 2) + '\n';
  await writeFile(DATA_FILE, json);

  console.log(`\nFetched ${ok}, failed ${failed}, of ${facilities.length} total`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
