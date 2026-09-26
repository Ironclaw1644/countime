import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'First Step Act and Bureau of Prisons news — Countime';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return renderOg({
    eyebrow: 'Updated hourly',
    title: 'First Step Act news',
    footer: 'BOP · DOJ · the press — headlines and links',
  });
}
