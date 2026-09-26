import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * One social-card design for every page: the night ground, a sodium glow,
 * the cream logotype small in the corner, and the page's own headline set
 * large in Bricolage Grotesque, the site's display face. Fonts and the logotype are read from disk, so a
 * card can't break on a network blip.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const NIGHT = '#140F0C';
const CREAM = '#F3E9DB';
const SOFT = '#CDBEAD';
const SODIUM = '#EEA856';
const RULE = 'rgba(243,233,219,0.14)';

export async function renderOg({
  eyebrow,
  title,
  second,
  footer = 'countime.net',
}: {
  eyebrow: string;
  title: string;
  /** Optional second line, in the sodium colour. */
  second?: string;
  footer?: string;
}) {
  const [logo, sans] = await Promise.all([
    readFile(join(process.cwd(), 'app/_og/logotype-cream.png')),
    readFile(join(process.cwd(), 'app/_fonts/BricolageGrotesque-SemiBold.ttf')),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;
  const size = title.length > 60 ? 58 : title.length > 36 ? 68 : 82;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          background: NIGHT,
          backgroundImage: `radial-gradient(circle at 85% 0%, rgba(238,168,86,0.28), rgba(20,15,12,0) 55%)`,
          fontFamily: 'Bricolage',
          color: CREAM,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Satori renders <img>, not next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={250} height={76} />
          <div style={{ display: 'flex', fontSize: 20, letterSpacing: '0.16em', textTransform: 'uppercase', color: SODIUM }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: size, lineHeight: 1.04, letterSpacing: '-0.03em', maxWidth: 1040 }}>
            {title}
          </div>
          {second && (
            <div style={{ display: 'flex', fontSize: size, lineHeight: 1.04, letterSpacing: '-0.03em', color: SODIUM, marginTop: 6 }}>
              {second}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${RULE}`,
            paddingTop: 24,
            fontSize: 24,
            color: SOFT,
          }}
        >
          {/* The tally mark */}
          <svg width="46" height="40" viewBox="0 0 34 32" fill="none" stroke={SODIUM} strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 4v24" />
            <path d="M13 4v24" />
            <path d="M20 4v24" />
            <path d="M27 4v24" />
            <path d="M2 25 31 7" />
          </svg>
          <div style={{ display: 'flex' }}>{footer}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Bricolage', data: sans, style: 'normal', weight: 600 },
      ],
    },
  );
}
