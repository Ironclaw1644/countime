import { renderOg, OG_SIZE } from '@/lib/og';

export const alt = 'Countime — First Step Act calculator and federal prison camp guide';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return renderOg({
    eyebrow: 'For families facing federal prison',
    title: 'How long will they actually serve?',
    second: 'Work out the date, then get ready for it.',
    footer: 'First Step Act calculator · facility map · handbooks · countime.net',
  });
}
