/**
 * First Step Act / Bureau of Prisons news, from free public RSS feeds only.
 *
 * Feeds (all checked by hand on 2026-09-26 — each returned items):
 *  - Google News search RSS, for a few narrow queries. Links point at
 *    news.google.com, which redirects to the publisher.
 *  - The Bureau of Prisons' own press-release RSS — the feed behind the "RSS"
 *    button on https://www.bop.gov/resources/press_releases.jsp.
 *  - DOJ Office of Public Affairs press releases, filtered hard, because most
 *    of it is individual prosecutions.
 *
 * We keep headline, source, date and link — never article bodies. Fetches go
 * through Next's data cache with an hourly revalidate, time out after eight
 * seconds, and a feed that fails simply contributes nothing, so one outage
 * never blanks the page.
 */

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  /** ISO timestamp */
  published: string;
  /** Which feed it came from — official sources get a badge. */
  kind: 'official' | 'press';
};

type Feed = {
  name: string;
  url: string;
  kind: NewsItem['kind'];
  /** Source label when the feed doesn't name one per item. */
  source?: string;
  /** Extra relevance test on top of the global one. */
  strict?: boolean;
};

const gnews = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

export const FEEDS: Feed[] = [
  {
    name: 'Bureau of Prisons press releases',
    url: 'https://www.bop.gov/PublicInfo/execute/news?todo=query&storyActive=1&output=rss&sortDescending=true&storyPressRelease=1',
    kind: 'official',
    source: 'Federal Bureau of Prisons',
  },
  {
    name: 'DOJ press releases',
    url: 'https://www.justice.gov/news/rss?type=press_release&m=1',
    kind: 'official',
    source: 'U.S. Department of Justice',
    strict: true,
  },
  { name: 'Google News — First Step Act', url: gnews('"First Step Act" prison'), kind: 'press' },
  { name: 'Google News — FSA time credits', url: gnews('"time credits" "Bureau of Prisons"'), kind: 'press' },
  { name: 'Google News — Bureau of Prisons', url: gnews('"Bureau of Prisons" (reentry OR "home confinement" OR "halfway house" OR camp)'), kind: 'press' },
];

/** Headlines have to be about federal custody and release to make the page. */
const RELEVANT =
  /first step act|\bFSA\b|time credit|bureau of prisons|\bBOP\b|federal prison|home confinement|halfway house|residential reentry|reentry|RDAP|prison camp|compassionate release|second chance act|good conduct time|clemency|sentenc/i;

/** Incident notices (deaths, walk-aways, arrests) aren't what readers come for. */
const NOISE = /\b(death|dies|died|escap\w*|walk(s|ed)?[- ]?away|fugitive|assault\w*|homicide|stabbing|arrested|apprehended|in custody after)\b/i;

/** For DOJ: only what bears on prisons, credits or release. */
const STRICT = /first step act|bureau of prisons|time credit|reentry|clemency|pardon|commutation|compassionate release|home confinement/i;

export async function getNews({ limit = 40 }: { limit?: number } = {}): Promise<{
  items: NewsItem[];
  failed: string[];
  fetchedAt: string;
}> {
  const results = await Promise.all(FEEDS.map((f) => fetchFeed(f)));
  const failed = FEEDS.filter((_, i) => results[i] === null).map((f) => f.name);

  const seen = new Set<string>();
  const items: NewsItem[] = [];
  for (const it of results
    .flatMap((r) => r ?? [])
    .sort((a, b) => b.published.localeCompare(a.published))) {
    const key = normalise(it.title);
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(it);
  }

  return { items: items.slice(0, limit), failed, fetchedAt: new Date().toISOString() };
}

async function fetchFeed(feed: Feed): Promise<NewsItem[] | null> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; countime.net news reader; +https://countime.net/news)' },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const charset = /charset=([\w-]+)/i.exec(res.headers.get('content-type') ?? '')?.[1] ?? 'utf-8';
    const xml = new TextDecoder(charset.toLowerCase() === 'iso-8859-1' ? 'latin1' : 'utf-8').decode(
      await res.arrayBuffer(),
    );
    return parseRss(xml, feed).filter((it) => {
      if (NOISE.test(it.title)) return false;
      if (feed.strict && !STRICT.test(it.title)) return false;
      // Official BOP releases are relevant by construction; everything else
      // has to say what it's about.
      return feed.source === 'Federal Bureau of Prisons' || RELEVANT.test(it.title);
    });
  } catch {
    return null;
  }
}

export function parseRss(xml: string, feed: Pick<Feed, 'kind' | 'source'>): NewsItem[] {
  const out: NewsItem[] = [];
  for (const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)) {
    const body = m[1];
    const tag = (name: string) => {
      const r = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i').exec(body);
      return r ? decode(r[1]) : '';
    };
    let title = tag('title');
    const url = tag('link').replace(/^http:\/\/www\.bop\.gov/, 'https://www.bop.gov');
    const date = new Date(tag('pubDate'));
    const source = tag('source') || feed.source || hostOf(url);
    // Google News appends " - Publisher" to every headline.
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    if (!title || !/^https?:\/\//.test(url) || Number.isNaN(date.getTime())) continue;
    out.push({
      id: `${normalise(title).slice(0, 60)}-${date.getTime()}`,
      title,
      url,
      source,
      published: date.toISOString(),
      kind: feed.kind,
    });
  }
  return out;
}

function decode(s: string): string {
  return s
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalise(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
