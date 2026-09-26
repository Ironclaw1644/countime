import { renderOg, OG_SIZE } from '@/lib/og';
import { getAllFacilities, getFacilityById, TYPE_LABEL, STATE_NAME } from '@/lib/facilities';

export const alt = 'Federal facility profile — Countime';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllFacilities().map((f) => ({ id: f.id }));
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = getFacilityById(id);
  return renderOg({
    eyebrow: f ? TYPE_LABEL[f.type] : 'Facility',
    title: f?.name ?? 'Federal facility',
    second: f ? `${f.city}, ${STATE_NAME[f.state] ?? f.state}` : undefined,
    footer: 'Address · handbook · programs · countime.net',
  });
}
