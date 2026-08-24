import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Countime — a calm guide to federal prison camps';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#F5EDE4';
const INK = '#2A211C';
const INK_MUTED = '#786959';
const ACCENT = '#A9524F';
const RULE = 'rgba(42,33,28,0.14)';

export default async function OgImage() {
  // Read from disk rather than fetching, so a social card can't break on a
  // network blip. The ink logotype is the variant that reads on warm paper.
  const [logo, displayFont] = await Promise.all([
    readFile(join(process.cwd(), 'public/brand/countime-logotype-ink.png')),
    readFile(join(process.cwd(), 'app/_fonts/BricolageGrotesque-SemiBold.ttf')),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: PAPER,
          fontFamily: 'Bricolage Grotesque, Helvetica, sans-serif',
        }}
      >
        {/* The ruled column grid the site is built on */}
        <div style={{ display: 'flex', position: 'absolute', inset: 0 }}>
          {[300, 600, 900].map((x) => (
            <div
              key={x}
              style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, background: RULE }}
            />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 20,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: INK_MUTED,
            }}
          >
            <div style={{ display: 'flex' }}>For families navigating federal sentencing</div>
            <div style={{ display: 'flex' }}>90 facilities</div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="Countime" width={860} height={262} style={{ objectFit: 'contain' }} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: `1px solid ${RULE}`,
              paddingTop: 28,
            }}
          >
            <div style={{ display: 'flex', fontSize: 30, color: INK, maxWidth: 760, lineHeight: 1.25 }}>
              Every federal minimum-security camp, checked against the Bureau&rsquo;s own records.
            </div>
            <div style={{ display: 'flex', fontSize: 26, color: ACCENT }}>countime.net</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Bricolage Grotesque', data: displayFont, style: 'normal', weight: 600 }],
    },
  );
}
