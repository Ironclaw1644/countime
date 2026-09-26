import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'Every federal prison camp, on one map — Countime';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return renderOg({ eyebrow: 'Map & directory', title: 'Every federal camp,', italic: 'on one map.' });
}
