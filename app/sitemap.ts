import type { MetadataRoute } from 'next';
import { getAllFacilities } from '@/lib/facilities';
import { getAllInsideTerms } from '@/lib/inside-terms';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/handbooks', priority: 0.9 },
    { path: '/the-inside', priority: 0.8 },
    { path: '/checklist', priority: 0.9 },
    { path: '/updates', priority: 0.7 },
    { path: '/prep-program', priority: 0.7 },
    { path: '/resources', priority: 0.5 },
    { path: '/about', priority: 0.4 },
    { path: '/contact', priority: 0.4 },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: r.priority,
  }));

  const facilities = getAllFacilities().map((f) => ({
    url: `${SITE_URL}/facilities/${f.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    // Closed facilities still deserve a page — people search them by name —
    // but they shouldn't outrank places someone could actually be sent.
    priority: f.status === 'CLOSED' ? 0.3 : 0.6,
  }));

  const terms = getAllInsideTerms().map((t) => ({
    url: `${SITE_URL}/the-inside/${t.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...facilities, ...terms];
}
