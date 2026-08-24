import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Send a correction, ask a question about self-surrender, or get in touch with Countime.',
};

export default function ContactPage() {
  return (
    <Section className="pb-24 pt-14 sm:pt-20">
      <Container width="narrow">
        <Eyebrow className="text-accent">Contact</Eyebrow>
        <h1 className="rule-under mt-4 text-3xl text-ink">Get in touch.</h1>
        <p className="mt-6 max-w-prose leading-relaxed text-ink-soft">
          Corrections are the most useful thing you can send us. Facility data
          changes constantly — camps close, programs get suspended, phone
          numbers move — and the people who notice first are usually the ones
          living it.
        </p>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
          This form is the only way to reach us right now. We do not publish an
          email address yet, and anything you see elsewhere claiming to be a
          Countime address is not ours.
        </p>

        <div className="mt-10 border-t border-rule pt-10">
          <ContactForm />
        </div>

        <p className="mt-10 border-t border-rule pt-6 text-xs leading-relaxed text-ink-muted">
          Countime is not a law firm and nothing here is legal advice. For
          advice about your own case, talk to your attorney. If you are in
          crisis, call or text 988 for the Suicide &amp; Crisis Lifeline.
        </p>
      </Container>
    </Section>
  );
}
