/**
 * One place for the things that change when the domain or contact route does.
 *
 * countime.net is the site. The .com is registered to someone else, so nothing
 * here may point at it — an earlier version shipped `hello@countime.com` links
 * that would have sent people's questions to a stranger.
 */
export const SITE_URL = 'https://countime.net';
export const SITE_NAME = 'Countime';
export const SITE_TAGLINE = 'A calm guide to federal prison camps';
export const SITE_DESCRIPTION =
  'An accurate, current map of every federal minimum-security camp — plus the official BOP handbooks, a self-surrender checklist, and plain-language answers for the people who love someone going in.';

/**
 * Set this only once a mailbox actually exists on countime.net. While it is
 * null the site routes people through the contact form instead of offering an
 * address that bounces.
 */
export const SUPPORT_EMAIL: string | null = null;
