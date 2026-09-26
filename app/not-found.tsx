import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { TallyMark } from '@/components/ui/Tally';
import { scripture } from '@/data/scripture';

const VERSE = scripture('luke-19-10');

const PATHS = [
  { href: '/calculator', label: 'Release calculator' },
  { href: '/facilities', label: 'Facility map & directory' },
  { href: '/handbooks', label: 'Handbook library' },
  { href: '/checklist', label: 'Self-surrender checklist' },
  { href: '/guides', label: 'Guides' },
];

export default function NotFound() {
  return (
    <section className="band-night overflow-hidden">
      <Container width="wide" className="py-20 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="numeral text-[clamp(6rem,4rem+10vw,14rem)] leading-none text-ink/10" aria-hidden>
              404
            </p>
            <h1 className="-mt-6 text-4xl text-ink sm:text-5xl">
              This page has gone <em className="serif-italic text-accent">missing.</em>
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
              Links shift over time — especially when the Bureau of Prisons renames a facility code. Every page below
              links straight to the official sources.
            </p>
            <figure className="mt-10 border-l border-accent/60 pl-5">
              <blockquote className="serif-italic text-2xl leading-snug text-ink">&ldquo;{VERSE.text}&rdquo;</blockquote>
              <figcaption className="eyebrow mt-3">{VERSE.ref} · We&rsquo;ll help you find your way.</figcaption>
            </figure>
          </div>
          <nav aria-label="Where to go instead">
            <ul className="border-t border-rule">
              {PATHS.map((p, i) => (
                <li key={p.href} className="border-b border-rule">
                  <Link href={p.href} className="group flex items-center justify-between gap-4 py-4">
                    <span className="font-display text-2xl text-ink transition-colors group-hover:text-accent">{p.label}</span>
                    <TallyMark count={i + 1} className="h-5 w-7 text-ink-faint group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
