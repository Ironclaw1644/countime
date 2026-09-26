import { pageMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHero } from '@/components/layout/PageHero';
import { ContactForm } from '@/components/ContactForm';

export const metadata = pageMetadata({
  title: 'Contact Countime',
  description:
    'Send a correction, ask a question about self-surrender, or get in touch with Countime.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
    <PageHero
      eyebrow="Contact"
      title="Get in touch."
      crumbs={[{ name: 'Contact', path: '/contact' }]}
      lede={
        <p>
          Corrections are the most useful thing you can send us. Facility data changes constantly — camps close,
          programs get suspended, phone numbers move — and the people who notice first are usually the ones living it.
        </p>
      }
    />
    <Section className="pb-24 pt-10">
      <Container width="narrow">
        <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
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
    </>
  );
}
