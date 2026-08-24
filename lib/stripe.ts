/**
 * Server-only Stripe client.
 *
 * Holds STRIPE_SECRET_KEY and never exposes it. Webhook handlers verify the
 * signature using STRIPE_WEBHOOK_SECRET.
 *
 * If STRIPE_SECRET_KEY is not set, `stripe()` throws. The pages and API
 * routes check `isStripeConfigured()` first and degrade gracefully to a
 * "join the founding-member waitlist" flow that only captures email.
 */
import 'server-only';
import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID_PREP_PROGRAM);
}

export function stripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');

  _stripe = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
    appInfo: { name: 'countime', url: 'https://countime.net' },
  });
  return _stripe;
}

export function stripePriceIdPrepProgram(): string {
  const id = process.env.STRIPE_PRICE_ID_PREP_PROGRAM;
  if (!id) throw new Error('STRIPE_PRICE_ID_PREP_PROGRAM is not set');
  return id;
}

export function stripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  return secret;
}
