'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const TOPICS = [
  'A correction to facility data',
  'A question about self-surrender',
  'The Surrender Prep Companion',
  'Press or partnership',
  'Something else',
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          name: data.get('name'),
          topic: data.get('topic'),
          message: data.get('message'),
          consented: data.get('consented') === 'on',
          company: data.get('company'),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? 'server_error');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(humanError(err instanceof Error ? err.message : 'server_error'));
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-accent/40 bg-accent/5 p-6">
        <p className="font-display text-xl text-ink">Message received.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Thank you — we read everything. If you asked a question we&rsquo;ll come
          back to you at the address you gave.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" hint="Optional">
          <input id="name" name="name" autoComplete="name" className={inputCls} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="What is this about?" htmlFor="topic">
        <select id="topic" name="topic" className={inputCls} defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea id="message" name="message" required rows={6} className={inputCls} />
      </Field>

      {/* Honeypot — hidden from people, catnip for bots */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-muted">
        <input type="checkbox" name="consented" className="mt-0.5 h-3.5 w-3.5 accent-[rgb(var(--accent))]" />
        <span>
          You can add me to the Countime list. We send rarely, and never share
          your address.
        </span>
      </label>

      {error && (
        <p role="alert" className="border border-state-warn/50 px-3 py-2 text-xs text-state-warn">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}

const inputCls =
  'w-full rounded border border-rule-strong bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow mb-2 block">
        {label}
        {hint && <span className="ml-2 normal-case tracking-normal text-ink-faint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function humanError(code: string): string {
  switch (code) {
    case 'invalid_email':
      return 'That email address does not look right — could you check it?';
    case 'empty_message':
      return 'Please add a message before sending.';
    case 'message_too_long':
      return 'That message is longer than we can accept. Could you trim it a little?';
    default:
      return 'Something went wrong sending that. Please try again in a moment.';
  }
}
