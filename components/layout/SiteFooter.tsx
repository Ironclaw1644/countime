import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-cream-100/40">
      <Container width="wide" className="py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-2xl tracking-tightest text-ink">
              countime
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
            <h3 className="small-caps text-xs text-ink-muted">Stay in touch</h3>
            <a
              href="mailto:hello@countime.com"
              className="mt-4 inline-flex items-center gap-2 text-sm text-ink hover:text-clay-deep"
            >
              <Icon icon={faEnvelope} className="text-clay" />
              hello@countime.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
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
      <h3 className="small-caps text-xs text-ink-muted">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-clay-deep"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
