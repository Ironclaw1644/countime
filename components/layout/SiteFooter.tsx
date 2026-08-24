import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/brand/Logo';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-paper-sunk/40">
      <Container width="wide" className="py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block text-ink transition-opacity hover:opacity-70" aria-label="Countime — home">
              <Logo height={30} />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              A quiet companion for families navigating sentencing to a federal prison camp.
              Built so you can plan with care, not panic.
            </p>
          </div>

          <FooterCol
            title="Explore"
            items={[
              { href: '/#map', label: 'Camp map' },
              { href: '/handbooks', label: 'Handbook library' },
              { href: '/the-inside', label: 'The Inside' },
              { href: '/checklist', label: 'Surrender checklist' },
              { href: '/updates', label: 'Facility updates' },
              { href: '/resources', label: 'Resources' },
            ]}
          />
          <FooterCol
            title="Organization"
            items={[
              { href: '/about', label: 'About Countime' },
              { href: '/contact', label: 'Contact us' },
            ]}
          />
          <div>
            <h3 className="eyebrow">Stay in touch</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Corrections and questions go through the contact form — we
              don&rsquo;t publish an email address.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block text-sm text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Write to us
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Countime. Built with care for families in transition.
          </p>
          <p className="max-w-2xl sm:text-right">
            Facility data and Admission &amp; Orientation handbooks are sourced from the
            Federal Bureau of Prisons (public domain). Verify details directly with the
            facility before traveling.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow text-xs text-ink-muted">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-accent-hover"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
