import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'First Step Act release date calculator — Countime';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return renderOg({
    eyebrow: 'Free · every rule cited',
    title: 'When could they come home?',
    second: 'The First Step Act calculator.',
    footer: 'Good conduct time · FSA credits · RDAP · home confinement',
  });
}
