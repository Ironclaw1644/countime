import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Reconciles Stripe events against our `countime.program_orders` table.
 *
 *  - checkout.session.completed → mark order paid, set payment_intent + customer_id
 *  - charge.refunded            → mark order refunded
 *  - checkout.session.expired   → mark order expired
 *
 * Configure this URL in the Stripe dashboard:
 *   https://dashboard.stripe.com/webhooks
 * Endpoint: https://countime.net/api/stripe-webhook
 * Events:   checkout.session.completed, charge.refunded, checkout.session.expired
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, stripeWebhookSecret());
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
     
    console.error('webhook_signature_invalid', msg);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  const admin = supabaseAdmin();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await admin
          .from('program_orders')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            stripe_customer_id:
              typeof session.customer === 'string' ? session.customer : null,
            amount_cents: session.amount_total ?? null,
            currency: session.currency ?? 'usd',
          })
          .eq('stripe_checkout_session_id', session.id);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await admin
          .from('program_orders')
          .update({ status: 'expired' })
          .eq('stripe_checkout_session_id', session.id)
          .eq('status', 'pending');
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
        if (pi) {
          await admin
            .from('program_orders')
            .update({
              status: 'refunded',
              refunded_at: new Date().toISOString(),
            })
            .eq('stripe_payment_intent_id', pi);
        }
        break;
      }
      default:
        // No-op for events we don't care about yet.
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
     
    console.error('webhook_handler_failed', event.type, msg);
    // Return 200 anyway — Stripe will retry on 5xx and we want the event
    // moved out of the retry queue. Persistent failures show in our logs.
    return NextResponse.json({ received: true, warning: 'handler_failed' });
  }
}
