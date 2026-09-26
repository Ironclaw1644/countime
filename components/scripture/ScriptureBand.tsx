'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { TallyMark } from '@/components/ui/Tally';
import { SCRIPTURE, type Scripture } from '@/data/scripture';
import { cn } from '@/lib/cn';

const INTERVAL = 9000;

/**
 * "Words for the road" — the scripture Countime shares from Graystone Prison
 * Ministry, one verse at a time on a night band.
 *
 * Auto-advances every nine seconds, but never under reduced motion, never
 * while hovered or focused, and it has a real pause button (WCAG 2.2.2).
 * The server renders the first verse so the band is never empty without JS.
 */
export function ScriptureBand({
  verses = SCRIPTURE,
  eyebrow = 'Words for the road',
  className,
}: {
  verses?: Scripture[];
  eyebrow?: string;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const running = playing && !hold && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % verses.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, i, verses.length]);

  const v = verses[i];
  const go = (d: number) => setI((n) => (n + d + verses.length) % verses.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={eyebrow}
      className={cn('band-night overflow-hidden py-20 sm:py-28', className)}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <Container width="wide">
        <div className="flex items-center justify-between gap-6">
          <p className="eyebrow flex items-center gap-3 !text-accent">
            <TallyMark className="h-4 w-5" count={(i % 5) + 1} />
            {eyebrow}
          </p>
          <p className="numeral text-lg text-ink-faint" aria-hidden>
            {String(i + 1).padStart(2, '0')}
            <span className="mx-1 text-ink-faint/60">/</span>
            {String(verses.length).padStart(2, '0')}
          </p>
        </div>

        <figure
          key={v.id}
          className="verse-enter mt-10 min-h-[13rem] max-w-5xl sm:min-h-[15rem]"
          aria-live={running ? 'off' : 'polite'}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${verses.length}`}
        >
          <blockquote className="serif-italic text-[clamp(1.75rem,1.2rem+2.6vw,3.5rem)] leading-[1.12] text-ink">
            <span aria-hidden className="mr-1 text-accent">&ldquo;</span>
            {v.text}
            <span aria-hidden className="text-accent">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-accent" />
            <span className="eyebrow !text-ink-soft">{v.ref}</span>
          </figcaption>
        </figure>

        <div className="mt-10 flex items-center gap-2">
          <BandButton onClick={() => go(-1)} label="Previous verse">
            <path d="M12.5 4.5 7 10l5.5 5.5" />
          </BandButton>
          <BandButton onClick={() => go(1)} label="Next verse">
            <path d="M7.5 4.5 13 10l-5.5 5.5" />
          </BandButton>
          {!reduced && (
            <BandButton
              onClick={() => setPlaying((p) => !p)}
              label={playing ? 'Pause verses' : 'Play verses'}
            >
              {playing ? <path d="M7.5 5v10M12.5 5v10" /> : <path d="M7 5l8 5-8 5z" />}
            </BandButton>
          )}
          <div className="ml-4 hidden h-px flex-1 overflow-hidden bg-rule sm:block" aria-hidden>
            {running && (
              <div
                key={`${v.id}-bar`}
                className="h-full origin-left bg-accent"
                style={{ animation: `bar-grow ${INTERVAL}ms linear both` }}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function BandButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-rule-strong text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
