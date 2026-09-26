import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

/**
 * Structured data and per-page metadata in one place.
 *
 * Every page builds its <head> through `pageMetadata()` so canonical URLs,
 * Open Graph and Twitter cards can't drift apart, and emits JSON-LD through
 * <JsonLd>. Schema types follow schema.org; Google's rich-result guidelines
 * decide which ones are worth the markup (FAQPage, Article, BreadcrumbList,
 * WebApplication).
 */

type Ld = Record<string, unknown>;

export function JsonLd({ data }: { data: Ld | Ld[] }) {
  const payload = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : { '@context': 'https://schema.org', ...data };
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so no string in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, '\\u003c') }}
    />
  );
}

export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  /** A punchier line for social cards, when the <title> is keyword-shaped. */
  ogTitle?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: ogTitle ?? title,
      description,
      url: abs(path),
      siteName: SITE_NAME,
      locale: 'en_US',
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function organizationLd(): Ld {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/brand/countime-logotype-ink.png`,
    },
    description: SITE_DESCRIPTION,
  };
}

export function websiteLd(): Ld {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Ld {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]): Ld {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleLd({
  title,
  description,
  path,
  published,
  modified,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified: string;
}): Ld {
  return {
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    url: abs(path),
    datePublished: published,
    dateModified: modified,
    image: abs(`${path}/opengraph-image`),
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-US',
  };
}

export function calculatorLd(): Ld {
  return {
    '@type': 'WebApplication',
    name: 'First Step Act release date calculator',
    url: abs('/calculator'),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Estimate a federal release date with good conduct time, First Step Act time credits, RDAP and Second Chance Act prerelease custody — every rule cited to the statute or regulation it comes from.',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
