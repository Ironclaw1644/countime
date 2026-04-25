import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { faArrowRight, faMap } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <Section className="pt-20 pb-32 sm:pt-32">
      <Container width="narrow" className="text-center">
        <p className="small-caps text-[11px] text-clay-deep">404</p>
        <h1 className="font-display mt-3 text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-ink-soft">
          Some links shift over time, especially when the Bureau of Prisons
          updates a facility code. Try the map or the handbook library — they
          link to the official sources.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" size="lg">
            <Icon icon={faMap} />
            Open the camp map
          </ButtonLink>
          <ButtonLink href="/handbooks" size="lg" variant="outline">
            Browse handbooks
            <Icon icon={faArrowRight} />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
