'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/** Intrinsic aspect of public/brand/countime-logotype.png (1764 × 537). */
const ASPECT = 1764 / 537;

type LogoProps = {
  /** Rendered height in px. Below ~22px the hairlines start to break up. */
  height?: number;
  className?: string;
  /** Set on the one instance that acts as the page's brand, e.g. the header. */
  title?: string;
};

/**
 * The countime.net logotype.
 *
 * Drawn as a CSS mask rather than an <img> so it paints in `currentColor` —
 * near-black on paper, soft cream at night — from a single asset. The source
 * artwork is a transparent PNG (there is no vector original), so the mask is
 * served at 2× the largest size we render it at.
 */
export function Logo({ height = 34, className, title = 'Countime' }: LogoProps) {
  const src = height > 60 ? '/brand/countime-logotype-240.png' : '/brand/countime-logotype-120.png';
  return (
    <span
      role="img"
      aria-label={title}
      className={cn('inline-block shrink-0 bg-current align-middle', className)}
      style={{
        height,
        width: height * ASPECT,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

/**
 * The tally mark — five strokes, the thing people actually do inside to mark
 * days. Used where the logotype's hairlines would disappear: favicons, avatars,
 * anywhere under about 40px.
 */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <rect width="32" height="32" rx="7.5" fill="var(--ink)" />
      <g stroke="var(--paper)" strokeWidth="2.1" strokeLinecap="round" fill="none">
        <path d="M9 9.5V22.5" />
        <path d="M13.6 9.5V22.5" />
        <path d="M18.2 9.5V22.5" />
        <path d="M22.8 9.5V22.5" />
        <path d="M6.6 23.2 25.2 8.8" stroke="var(--accent)" />
      </g>
    </svg>
  );
}

/**
 * The logotype at display scale — it fills its container's width and becomes
 * the headline rather than sitting above one. Set at the largest asset so the
 * hairlines stay crisp when it spans the viewport.
 */
/** The hero mask. Luminance+alpha rather than RGBA — a mask only reads alpha. */
const DISPLAY_MASK = '/brand/countime-logotype-mask.png';

export function LogoDisplay({
  className,
  title = 'Countime',
  animate = false,
}: {
  className?: string;
  title?: string;
  /** Draw the lettering on once, as though it were being written. */
  animate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.write = 'done';
      return;
    }

    // Release the curtain only once the lettering has decoded, so the sweep
    // never runs against an image that hasn't arrived.
    let cancelled = false;
    const start = () => {
      if (!cancelled) el.dataset.write = 'run';
    };

    const img = new Image();
    img.src = DISPLAY_MASK;
    if (img.decode) {
      img.decode().then(start).catch(start);
    } else {
      img.onload = start;
      img.onerror = start;
    }

    // Never leave the logotype half-covered if decoding stalls.
    const failsafe = window.setTimeout(start, 3000);
    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, [animate]);

  const src = `url(${DISPLAY_MASK})`;
  const ink: React.CSSProperties = {
    aspectRatio: String(ASPECT),
    maskImage: src,
    WebkitMaskImage: src,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  };

  if (!animate) {
    return (
      <span
        role="img"
        aria-label={title}
        className={cn('block w-full bg-current', className)}
        style={ink}
      />
    );
  }

  return (
    <span
      ref={ref}
      role="img"
      aria-label={title}
      className={cn('write-stage', className)}
      style={{ aspectRatio: String(ASPECT) }}
    >
      <span aria-hidden className="block h-full w-full bg-current" style={ink} />
      <span aria-hidden className="write-veil" />
    </span>
  );
}
