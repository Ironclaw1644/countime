import type { Metadata, Viewport } from 'next';
import { Fraunces, Public_Sans } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import '@/lib/fontawesome';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://countime.com'),
  title: {
    default: 'Countime — A guide for families of federal prison camp inmates',
    template: '%s · Countime',
  },
  description:
    'Countime helps white-collar offenders and their families prepare for and stay informed about federal prison camps. Interactive map of every FPC and downloadable handbooks.',
  keywords: [
    'federal prison camp',
    'FPC',
    'BOP',
    'white collar',
    'sentencing',
    'RDAP',
    'A&O handbook',
    'prison family resources',
  ],
  openGraph: {
    type: 'website',
    title: 'Countime — A guide for families of federal prison camp inmates',
    description:
      'Interactive map of every Federal Prison Camp and the official handbooks families need.',
    url: 'https://countime.com',
    siteName: 'Countime',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Countime',
    description: 'A guide for families of federal prison camp inmates.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
