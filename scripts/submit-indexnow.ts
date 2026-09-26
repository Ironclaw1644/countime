/**
 * Push every sitemap URL to IndexNow (Bing, Yandex, Seznam — and DuckDuckGo,
 * which reads Bing's index).
 *
 * Why this exists: on 2026-09-26 a `site:countime.net` check found exactly one
 * of 111 URLs in Bing's index. Nothing was blocking the crawler — robots.txt
 * allows everything, no page carries `noindex`, Googlebot gets a 200 — the site
 * simply has no inbound links, so no crawler had a reason to come looking.
 * IndexNow is the one channel that does not need a console login or a verified
 * property: host a key file, POST the URL list, done.
 *
 * Google does NOT participate in IndexNow. Google still needs the sitemap
 * submitted once in Search Console by hand.
 *
 * Usage: npm run submit:indexnow
 */
import { getAllFacilities } from '../lib/facilities';
import { getAllInsideTerms } from '../lib/inside-terms';
import { SITE_URL } from '../lib/site';

/** Must match the filename in public/ — the endpoint fetches it to prove ownership. */
const KEY = '3508acf5332693424630a8b929caf38f';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const STATIC_PATHS = [
  '',
  '/handbooks',
  '/the-inside',
  '/checklist',
  '/updates',
  '/prep-program',
  '/resources',
  '/about',
  '/contact',
];

function buildUrlList(): string[] {
  return [
    ...STATIC_PATHS.map((p) => `${SITE_URL}${p}`),
    ...getAllFacilities().map((f) => `${SITE_URL}/facilities/${f.id}`),
    ...getAllInsideTerms().map((t) => `${SITE_URL}/the-inside/${t.id}`),
  ];
}

async function main() {
  const host = new URL(SITE_URL).host;
  const urlList = buildUrlList();

  // Prove the key file is actually live before submitting. A 404 here means the
  // deploy has not landed yet, and IndexNow would reject the whole batch as
  // unverified — better to say so than to log a silent failure.
  const keyUrl = `${SITE_URL}/${KEY}.txt`;
  const keyRes = await fetch(keyUrl);
  if (!keyRes.ok) {
    console.error(`✗ key file not reachable: ${keyUrl} → ${keyRes.status}`);
    console.error('  Deploy first, then rerun.');
    process.exit(1);
  }
  if ((await keyRes.text()).trim() !== KEY) {
    console.error(`✗ ${keyUrl} does not contain the expected key`);
    process.exit(1);
  }
  console.log(`✓ key file verified at ${keyUrl}`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: KEY, keyLocation: keyUrl, urlList }),
  });

  const body = await res.text();
  console.log(`IndexNow → ${res.status} ${res.statusText} (${urlList.length} URLs)`);
  if (body.trim()) console.log(body.trim());

  // 200 accepted, 202 accepted but key still validating. Anything else is a real
  // failure worth a non-zero exit so a scheduled run shows red.
  if (res.status !== 200 && res.status !== 202) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
