import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/brand/Logo';
import { TallyMark } from '@/components/ui/Tally';
import { GUIDES } from '@/data/guides';
import { scripture } from '@/data/scripture';

const CLOSING = scripture('matthew-25-36');

export function SiteFooter() {
  return (
    <footer
      className="band-night mt-24 overflow-hidden"
      style={{ ['--lamp-x' as string]: '18%', ['--lamp-y' as string]: '0%' }}
    >
      {/* The closing verse, set big — the last thing on every page. */}
      <Container width="wide" className="pt-20 sm:pt-28">
        <figure className="max-w-5xl">
          <TallyMark className="h-8 w-12 text-accent" />
          <blockquote className="mt-6 font-display text-4xl leading-[1.02] text-ink sm:text-5xl">
            &ldquo;I was in prison and <span className="text-accent">you came to me.</span>&rdquo;
          </blockquote>
          <figcaption className="eyebrow mt-5">{CLOSING.ref}</figcaption>
        </figure>
      </Container>

      <Container width="wide" className="pb-12 pt-20">
        <div className="grid gap-12 border-t border-rule pt-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block text-ink transition-opacity hover:opacity-70" aria-label="Countime — home">
              <Logo height={34} />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
              A calm companion for families facing federal prison — the dates,
              the places, the paperwork and the words, checked against the
              Bureau of Prisons&rsquo; own sources.
            </p>
            <Link
              href="/calculator"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-on transition-colors hover:bg-accent-hover"
            >
              Estimate a release date <span aria-hidden>→</span>
            </Link>
          </div>

          <FooterCol
            title="Tools"
            items={[
              { href: '/calculator', label: 'First Step Act calculator' },
              { href: '/facilities', label: 'Facility map & directory' },
              { href: '/handbooks', label: 'A&O handbook library' },
              { href: '/checklist', label: 'Self-surrender checklist' },
              { href: '/prep-program', label: 'Surrender Prep Companion' },
            ]}
          />
          <FooterCol
            title="Learn"
            items={[
              ...GUIDES.map((g) => ({ href: `/guides/${g.slug}`, label: g.shortTitle })),
              { href: '/the-inside', label: 'The Inside — glossary' },
              { href: '/news', label: 'First Step Act news' },
              { href: '/updates', label: 'Facility closures & changes' },
            ]}
          />
          <FooterCol
            title="Countime"
            items={[
              { href: '/about', label: 'About' },
              { href: '/resources', label: 'Official resources' },
              { href: '/contact', label: 'Contact & corrections' },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-rule pt-6 text-xs leading-relaxed text-ink-muted lg:flex-row lg:items-start lg:justify-between">
          <p>© {new Date().getFullYear()} Countime. Built with care for families in transition.</p>
          <p className="max-w-3xl lg:text-right">
            Countime is not a law firm and nothing here is legal advice. Release-date
            estimates are estimates; the Bureau of Prisons computes the official date.
            Facility data and handbooks come from the Federal Bureau of Prisons (public
            domain) — verify details with the facility before travelling. Scripture
            quotations shared with gratitude from Graystone Prison Ministry.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="eyebrow">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-ink-soft transition-colors hover:text-accent">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
