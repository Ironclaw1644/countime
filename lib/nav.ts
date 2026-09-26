/**
 * Site navigation — one list shared by the header, the mobile sheet and the
 * footer, so a new page can't end up reachable from one and not the others.
 * `cta` items render as the header's pill button instead of a text link.
 */
export type NavItem = { href: string; label: string; note?: string; cta?: boolean };

export const NAV: NavItem[] = [
  { href: '/calculator', label: 'Release calculator', note: 'New', cta: true },
  { href: '/facilities', label: 'Facilities' },
  { href: '/handbooks', label: 'Handbooks' },
  { href: '/checklist', label: 'Prepare' },
  { href: '/guides', label: 'Guides' },
  { href: '/news', label: 'News' },
  { href: '/the-inside', label: 'The Inside' },
];
