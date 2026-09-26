import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ThemeScript } from '@/components/layout/ThemeScript';
import { Reveal } from '@/components/layout/Reveal';
import { ColumnRules } from '@/components/layout/ColumnRules';
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/site';
import { JsonLd, organizationLd, websiteLd } from '@/lib/seo';
import '@/lib/fontawesome';
import './globals.css';

// Instrument Serif for headlines and scripture — a sharp, bookish serif that
// sits well beside the hand-lettered logotype. Bricolage Grotesque carries body
// copy and UI, and at its narrowest width (wdth 75) sets the condensed numerals
// the calculator and ledger rows are built from — one variable file doing the
// work of two families.
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'First Step Act calculator',
    'FSA time credits',
    'federal release date calculator',
    'good conduct time',
    'federal prison camp',
    'FPC',
    'BOP',
    'self-surrender',
    'voluntary surrender',
    'white collar',
    'sentencing',
    'RDAP',
    'A&O handbook',
    'prison family resources',
  ],
  openGraph: {
    type: 'website',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5EDE4' },
    { media: '(prefers-color-scheme: dark)', color: '#140F0C' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <noscript>
          {/* The write-on starts paused and is released by JS; without JS,
              show the finished lettering rather than a clipped one. */}
          <style>{`.write-ink{animation:none!important}.write-nib{display:none!important}`}</style>
        </noscript>
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body>
        <ThemeScript />
        <Reveal />
        <ColumnRules />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
