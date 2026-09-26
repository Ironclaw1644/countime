import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'Countime guides — the rules, in plain words';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return renderOg({ eyebrow: 'Guides', title: 'The rules,', italic: 'in plain words.' });
}
