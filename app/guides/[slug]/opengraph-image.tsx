import { renderOg, OG_SIZE } from '@/lib/og';
import { GUIDES, getGuide } from '@/data/guides';

export const alt = 'A Countime guide';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  return renderOg({
    eyebrow: `Guide · ${g?.readingTime ?? 5} min read`,
    title: g?.title ?? 'Countime guide',
    footer: 'Every statement linked to its source · countime.net',
  });
}
