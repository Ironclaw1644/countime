'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/#map', label: 'Map' },
  { href: '/handbooks', label: 'Handbooks' },
  { href: '/the-inside', label: 'The Inside' },
  { href: '/checklist', label: 'Checklist' },
  { href: '/updates', label: 'Updates' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
          <Link
            href="/"
            className="text-ink transition-opacity duration-200 hover:opacity-70"
            aria-label="Countime — home"
          >
            <Logo height={30} className="sm:!h-[34px] sm:!w-[112px]" />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => {
                const active =
                  item.href.startsWith('/#')
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative py-1 text-xs tracking-[0.1em] uppercase transition-colors duration-200',
                        'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left',
                        'after:scale-x-0 after:bg-current after:transition-transform after:duration-300',
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

          <div className="flex items-center gap-1">
            <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded text-ink-muted transition-colors hover:bg-paper-sunk hover:text-ink" />

            <div className="relative md:hidden" ref={panelRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="flex h-9 w-9 items-center justify-center rounded text-ink transition-colors hover:bg-paper-sunk"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  {open ? <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" /> : <path d="M2 4.5h12M2 11.5h12" />}
                </svg>
              </button>

              {open && (
                <div
                  id="mobile-nav"
                  className="absolute right-0 top-11 w-56 border border-rule bg-paper-raised py-1 shadow-lift"
                >
                  <ul className="flex flex-col">
                    {NAV.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-paper-sunk hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
