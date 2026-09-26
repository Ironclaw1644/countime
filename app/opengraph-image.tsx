import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'Countime — know the date, prepare for the days';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return renderOg({
    eyebrow: 'For families facing federal prison',
    title: 'Know the date.',
    italic: 'Prepare for the days.',
    footer: 'First Step Act calculator · facility map · handbooks · countime.net',
  });
}
