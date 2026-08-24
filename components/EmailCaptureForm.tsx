'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import {
  faArrowRight,
  faCircleNotch,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/cn';

type Mode = 'subscribe' | 'checkout';

type Source =
  | 'checklist'
  | 'prep_program_waitlist'
  | 'prep_program_purchase'
  | 'footer'
  | 'contact';

interface Props {
  mode: Mode;
  source: Source;
  /** Where to send the user after a successful subscribe (mode=subscribe only) */
  successPath?: string;
  /** Placeholder shown in the email input */
  placeholder?: string;
  /** CTA label */
  cta: string;
  /** Small disclaimer line shown below the form */
  disclaimer?: string;
  /** Style variant */
  variant?: 'default' | 'inline' | 'card';
  /** Optional extra metadata to send with the subscription */
  metadata?: Record<string, unknown>;
}

export function EmailCaptureForm({
  mode,
  source,
  successPath = '/checklist/thanks',
  placeholder = 'you@example.com',
  cta,
  disclaimer,
  variant = 'default',
  metadata,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setBusy(true);

    try {
      if (mode === 'subscribe') {
        const r = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: trimmed,
            source,
            consented: true,
            metadata,
          }),
        });
        const json = (await r.json()) as { ok: boolean; error?: string };
        if (!r.ok || !json.ok) {
          setError(humanError(json.error));
          setBusy(false);
          return;
        }
        router.push(successPath);
        return;
      }

      // mode === 'checkout'
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: trimmed, consented: true }),
      });
      const json = (await r.json()) as {
        ok: boolean;
        mode?: 'stripe' | 'waitlist';
        url?: string;
        error?: string;
      };

      if (!r.ok || !json.ok) {
        setError(humanError(json.error));
        setBusy(false);
        return;
      }
      if (json.mode === 'stripe' && json.url) {
        window.location.href = json.url;
        return;
      }
      // Stripe not configured yet → graceful waitlist landing.
      router.push('/prep-program/thanks?mode=waitlist');
    } catch (err) {
       
      console.error('email_capture_failed', err);
      setError('Something went wrong on our end. Please try again in a moment.');
      setBusy(false);
    }
  }

  const inputBase =
    'w-full bg-transparent text-[15px] text-ink placeholder:text-ink-muted focus:outline-none';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        'flex flex-col gap-2',
        variant === 'card' && 'rounded border border-rule bg-paper-raised/80 p-5 shadow-raise',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 rounded border border-rule-strong bg-paper px-4 py-2.5',
          'focus-within:border-accent focus-within:bg-paper-raised',
        )}
      >
        <Icon icon={faEnvelope} className="text-accent" />
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Email address"
          className={inputBase}
        />
        <button
          type="submit"
          disabled={busy}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded bg-accent px-4 py-2 text-xs font-medium text-accent-on transition-colors',
            'hover:bg-accent-hover disabled:opacity-60',
          )}
        >
          {busy ? (
            <>
              <Icon icon={faCircleNotch} className="animate-spin text-[11px]" />
              One moment…
            </>
          ) : (
            <>
              {cta}
              <Icon icon={faArrowRight} className="text-[11px]" />
            </>
          )}
        </button>
      </div>
      {error && <p className="text-[12px] text-accent-hover">{error}</p>}
      {disclaimer && !error && (
        <p className="text-[11px] leading-relaxed text-ink-muted">{disclaimer}</p>
      )}
    </form>
  );
}

function humanError(code?: string): string {
  switch (code) {
    case 'invalid_email':
      return 'That email doesn’t look right. Try again?';
    case 'not_configured':
      return 'Sign-ups aren’t switched on yet — we’re still setting this up. Please try again in a day or two.';
    case 'bad_json':
      return 'Something got garbled. Please refresh and try again.';
    case 'checkout_failed':
      return 'Payment setup hiccup. We saved your email — please try again, or use the contact form and we will sort it out.';
    default:
      return 'Something went wrong on our end. Please try again in a moment.';
  }
}
