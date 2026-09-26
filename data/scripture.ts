/**
 * Words for the road.
 *
 * Every scripture quotation used on the Graystone Prison Ministry site
 * (~/Projects/graystone-prison-ministry: src/data/site.ts, src/pages/*.astro,
 * src/components/*.astro), copied verbatim with the reference exactly as GPM
 * sets it. Where GPM quotes the same verse in two forms — a short line in one
 * place, the longer passage in another — both are kept, because the short
 * form is what fits a band and the long one is what fits a page.
 *
 * Only scripture lives here. GPM's own testimonials and the founder's letter
 * are about GPM's people and stay on GPM's site.
 */
export type Scripture = {
  id: string;
  text: string;
  ref: string;
  /** Where on the GPM site it appears — kept so provenance is checkable. */
  gpmSource: string;
};

export const SCRIPTURE: Scripture[] = [
  {
    id: 'matthew-25-36',
    text: 'I was in prison and you came to me.',
    ref: 'Matthew 25:36',
    gpmSource: 'src/pages/index.astro (closing verse)',
  },
  {
    id: 'deuteronomy-31-8',
    text: 'The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.',
    ref: 'Deuteronomy 31:8',
    gpmSource: 'src/pages/story.astro (page hero)',
  },
  {
    id: 'galatians-6-2',
    text: 'Carry each other’s burdens, and in this way you will fulfill the law of Christ.',
    ref: 'Galatians 6:2',
    gpmSource: 'src/pages/families.astro (Scripture for the road)',
  },
  {
    id: 'proverbs-16-9',
    text: 'The heart of man plans his way, but the Lord establishes his steps.',
    ref: 'Proverbs 16:9',
    gpmSource: 'src/pages/timeline.astro (page hero)',
  },
  {
    id: 'ecclesiastes-4-9-10',
    text: 'Two people are better than one because they help each other up when they fall.',
    ref: 'Ecclesiastes 4:9–10',
    gpmSource: 'src/pages/families.astro (Scripture for the road)',
  },
  {
    id: 'philippians-4-12-13',
    text: 'I have learned the secret of being content in any and every situation… I can do all this through him who gives me strength.',
    ref: 'Philippians 4:12–13',
    gpmSource: 'src/pages/families.astro (page hero)',
  },
  {
    id: '1-thessalonians-5-11',
    text: 'Encourage one another and build each other up.',
    ref: '1 Thessalonians 5:11',
    gpmSource: 'src/pages/families.astro (Scripture for the road)',
  },
  {
    id: 'luke-15-10',
    text: 'In the same way, I tell you, there is rejoicing in the presence of the angels of God over one sinner who repents.',
    ref: 'Luke 15:10',
    gpmSource: 'src/data/site.ts (site.verse)',
  },
  {
    id: 'james-5-16',
    text: 'The prayer of a righteous person is powerful and effective.',
    ref: 'James 5:16',
    gpmSource: 'src/pages/connect.astro (prayer request)',
  },
  {
    id: 'romans-12-4-8',
    text: 'For just as each of us has one body with many members… if it is serving, then serve; if it is to encourage, then give encouragement.',
    ref: 'Romans 12:4–8',
    gpmSource: 'src/pages/index.astro (Four ways to serve)',
  },
  {
    id: 'luke-19-10',
    text: 'For the Son of Man came to seek and to save the lost.',
    ref: 'Luke 19:10',
    gpmSource: 'src/pages/404.astro',
  },
  {
    id: '2-corinthians-9-7',
    text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
    ref: '2 Corinthians 9:7',
    gpmSource: 'src/pages/give.astro (page hero)',
  },
];

/** The shorter forms GPM also uses. Same verses, fewer words. */
export const SCRIPTURE_SHORT: Scripture[] = [
  {
    id: 'matthew-25-36-visit',
    text: 'I was in prison and you came to visit me.',
    ref: 'Matthew 25:36',
    gpmSource: 'src/components/Nav.astro (drawer verse)',
  },
  {
    id: 'deuteronomy-31-8-short',
    text: 'The Lord himself goes before you and will be with you; he will never leave you nor forsake you.',
    ref: 'Deuteronomy 31:8',
    gpmSource: 'src/components/Timeline.astro, src/pages/timeline.astro',
  },
  {
    id: 'luke-15-10-short',
    text: 'There is rejoicing in the presence of the angels of God over one sinner who repents.',
    ref: 'Luke 15:10',
    gpmSource: 'src/components/Hero.astro',
  },
];

export function scripture(id: string): Scripture {
  const s = [...SCRIPTURE, ...SCRIPTURE_SHORT].find((q) => q.id === id);
  if (!s) throw new Error(`Unknown scripture id: ${id}`);
  return s;
}
