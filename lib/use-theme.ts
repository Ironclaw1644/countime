'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
export const THEME_KEY = 'countime-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/**
 * The theme actually on screen.
 *
 * The device setting is the default; an explicit choice from the header toggle
 * writes `data-theme` on the root element and overrides it in both directions.
 * Subscribing to both sources — rather than syncing state in an effect — keeps
 * this off the render-then-correct path, and means a reader who changes their
 * OS appearance mid-visit sees the site follow along.
 */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener('change', onChange);
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    mq.removeEventListener('change', onChange);
    mo.disconnect();
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'dark' || explicit === 'light') return explicit;
  return systemTheme();
}

function getServerSnapshot(): Theme {
  // No way to know the device setting on the server; the CSS media query
  // handles the first paint, and this corrects on hydration.
  return 'light';
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Records an explicit choice. Choosing the theme the device is already on
 * clears the override instead, so the site goes back to following the device.
 */
export function setTheme(next: Theme): void {
  const root = document.documentElement;
  if (next === systemTheme()) {
    root.removeAttribute('data-theme');
    try {
      localStorage.removeItem(THEME_KEY);
    } catch {
      /* private browsing */
    }
    // Removing the attribute is itself a data-theme mutation, so subscribers
    // are notified without any extra nudge.
    return;
  }
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* private browsing — the choice just won't persist */
  }
}
