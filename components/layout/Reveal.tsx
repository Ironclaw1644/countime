'use client';

import { useEffect } from 'react';

/**
 * Reveals [data-reveal] elements as they scroll into view.
 *
 * Progressive enhancement on purpose: the CSS only hides these elements once
 * this component has marked the document ready, so if JavaScript never runs —
 * or the reader prefers reduced motion — the content is simply visible rather
 * than stuck at opacity 0.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    root.setAttribute('data-reveal-ready', '');

    const show = (el: Element) => el.setAttribute('data-reveal', 'shown');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          // Pages mark stagger order as data-reveal="1".."5"; turn that into
          // a short cascade rather than everything arriving at once.
          const step = Number(el.getAttribute('data-reveal')) || 0;
          const delay = Math.min(step, 6) * 70;
          if (delay) window.setTimeout(() => show(el), delay);
          else show(el);
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    const observe = () => {
      document
        .querySelectorAll('[data-reveal]:not([data-reveal="shown"])')
        .forEach((el) => {
          // Anything already on screen at load reveals immediately, so the
          // first viewport is never blank.
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) show(el);
          else io.observe(el);
        });
    };
    observe();

    // Client-routed pages bring new nodes with them.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.removeAttribute('data-reveal-ready');
    };
  }, []);

  return null;
}
