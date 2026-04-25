import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import {
  faEnvelope,
  faShieldHeart,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Countime.',
};

export default function ContactPage() {
  return (
    <>
      <Section className="pt-12 pb-12 sm:pt-20">
        <Container width="narrow">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-50/70 px-3 py-1 text-[11px] text-ink-muted shadow-paper">
            <Icon icon={faEnvelope} className="text-clay" />
            <span className="small-caps">Get in touch</span>
          </div>
          <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tightest text-ink sm:text-6xl">
            Write to us. We read every note.
          </h1>
          <p className="mt-6 text-pretty text-[17px] leading-relaxed text-ink-soft">
            Whether you have a correction, a question, a story you&rsquo;d be
            willing to share, or a facility you&rsquo;d like added to the map,
            we&rsquo;d love to hear from you.
          </p>
        </Container>
      </Section>

      <Section className="py-10">
        <Container width="narrow">
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:hello@countime.com"
              className="group rounded-2xl border border-ink/10 bg-cream-50/70 p-6 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Icon icon={faEnvelope} className="text-2xl text-clay" />
              <h3 className="font-display mt-4 text-2xl leading-tight tracking-tightest text-ink group-hover:text-clay-deep">
                hello@countime.com
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                For corrections, questions, and partnership inquiries.
              </p>
            </a>
            <a
              href="mailto:families@countime.com"
              className="group rounded-2xl border border-ink/10 bg-cream-50/70 p-6 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Icon icon={faShieldHeart} className="text-2xl text-clay" />
              <h3 className="font-display mt-4 text-2xl leading-tight tracking-tightest text-ink group-hover:text-clay-deep">
                families@countime.com
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                A direct line for families who&rsquo;d like to connect quietly.
              </p>
            </a>
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-clay/20 bg-clay/5 p-5 text-[14px] leading-relaxed text-ink-soft">
            <Icon icon={faCircleInfo} className="mt-0.5 text-clay-deep" />
            <p>
              Countime is not a law firm. We don&rsquo;t give legal advice and
              we can&rsquo;t intervene in cases. For legal questions, please
              speak with your attorney.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
