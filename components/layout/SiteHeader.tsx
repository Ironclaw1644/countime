'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/cn';
import { NAV } from '@/lib/nav';
import { scripture } from '@/data/scripture';

const DRAWER_VERSE = scripture('matthew-25-36-visit');

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close the sheet whenever the route changes (adjusting state during render
  // rather than in an effect, per React's guidance for derived resets).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        // Night in both themes, so it runs straight into the night heroes.
        'band-night no-lamp sticky top-0 z-40 border-b transition-[box-shadow,border-color] duration-300',
        scrolled || open ? 'border-rule shadow-[0_10px_30px_-20px_rgb(0_0_0/0.7)]' : 'border-transparent',
      )}
    >
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Link
            href="/"
            className="text-ink transition-opacity duration-200 hover:opacity-70"
            aria-label="Countime — home"
          >
            <Logo height={30} className="lg:!h-[34px] lg:!w-[112px]" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV.filter((n) => !n.cta).map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative py-1 text-[0.8125rem] font-medium transition-colors duration-200',
                        'after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:origin-left after:rounded-full',
                        'after:scale-x-0 after:bg-accent after:transition-transform after:duration-300',
                        'hover:after:scale-x-100',
                        active ? 'text-ink after:scale-x-100' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/calculator"
              aria-current={isActive('/calculator') ? 'page' : undefined}
              className={cn(
                'group hidden items-center gap-2 rounded-full border border-ink/80 py-2 pl-3 pr-4 text-[0.8125rem] font-semibold transition-colors duration-300 sm:inline-flex',
                isActive('/calculator') ? 'bg-ink text-paper' : 'text-ink hover:bg-ink hover:text-paper',
              )}
            >
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sodium opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sodium" />
              </span>
              Release calculator
            </Link>
            <ThemeToggle className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper-sunk hover:text-ink" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-sunk lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                {open ? (
                  <path d="M4.5 4.5 15.5 15.5M15.5 4.5 4.5 15.5" />
                ) : (
                  <>
                    <path d="M3 6.5h14" />
                    <path d="M3 13.5h9" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile sheet: full-height night, big serif links, a verse at the foot. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="band-night fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto lg:hidden"
      >
        <Container width="wide" className="flex min-h-full flex-col py-6">
          <nav aria-label="Mobile">
            <ol>
              {NAV.map((item, i) => (
                <li key={item.href} className="border-b border-rule">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="group flex items-baseline gap-4 py-3.5"
                  >
                    <span className="numeral w-7 text-sm text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-3xl text-ink transition-colors group-hover:text-accent">
                      {item.label}
                    </span>
                    {item.note && <span className="eyebrow ml-auto !text-accent">{item.note}</span>}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <figure className="mt-auto pt-10">
            <blockquote className="serif-italic text-2xl leading-snug text-ink">
              &ldquo;{DRAWER_VERSE.text}&rdquo;
            </blockquote>
            <figcaption className="eyebrow mt-3">{DRAWER_VERSE.ref}</figcaption>
          </figure>
        </Container>
      </div>
    </header>
  );
}
