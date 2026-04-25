import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NAV = [
  { href: '/#map', label: 'Map' },
  { href: '/handbooks', label: 'Handbooks' },
  { href: '/the-inside', label: 'The Inside' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="group flex items-baseline gap-2 focus-visible:outline-none"
            aria-label="Countime — home"
          >
            <span className="font-display text-2xl sm:text-[28px] tracking-tightest text-ink leading-none">
              countime
            </span>
            <span
              aria-hidden
              className="hidden h-2 w-2 rounded-full bg-clay transition-transform duration-300 group-hover:scale-125 sm:inline-block"
            />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 text-[15px]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-full px-4 py-2 text-ink-soft transition-colors hover:bg-cream-100 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <details className="md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-ink hover:bg-cream-100">
              <Icon icon={faBars} label="Open menu" />
            </summary>
            <div className="absolute right-4 mt-2 w-56 rounded-2xl border border-ink/10 bg-cream-50 p-2 shadow-lift">
              <ul className="flex flex-col">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-2.5 text-ink-soft hover:bg-cream-100 hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
