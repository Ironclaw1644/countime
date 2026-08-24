import { NextRequest, NextResponse } from 'next/server';
import {
  isStripeConfigured,
  stripe,
  stripePriceIdPrepProgram,
} from '@/lib/stripe';
import { upsertSubscriber, isValidEmail } from '@/lib/subscribers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SITE_URL } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const body = payload as { email?: unknown; consented?: unknown };
  const email = typeof body.email === 'string' ? body.email : '';
  const consented = body.consented === true;

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null;
  const userAgent = req.headers.get('user-agent');
  const referrer = req.headers.get('referer');

  // Always upsert as a subscriber first so the email gets captured even if
  // the user abandons checkout. Source flags this as a high-intent contact.
  let subscriberId: string;
  try {
    const subscriber = await upsertSubscriber({
      email,
      source: 'prep_program_purchase',
      consented,
      ip,
      userAgent,
      referrer,
    });
    subscriberId = subscriber.id;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
     
    console.error('checkout_subscribe_failed', msg);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }

  // If Stripe isn't configured yet, drop the customer onto the waitlist
  // gracefully — the page handles this by routing to the thanks page.
  if (!isStripeConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: 'waitlist',
      subscriberId,
    });
  }

  // Stripe configured: create a Checkout Session and a pending order row.
  const origin = req.headers.get('origin') ?? SITE_URL;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: stripePriceIdPrepProgram(), quantity: 1 }],
      customer_email: email.trim().toLowerCase(),
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${origin}/prep-program/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/prep-program?cancelled=1`,
      metadata: {
        countime_subscriber_id: subscriberId,
        product: 'surrender_prep_companion',
        plan: 'founding_member',
      },
    });

    // Insert a pending order row for tracking.
    const admin = supabaseAdmin();
    const { error: orderErr } = await admin.from('program_orders').insert({
      subscriber_id: subscriberId,
      email: email.trim().toLowerCase(),
      plan: 'founding_member',
      status: 'pending',
      stripe_checkout_session_id: session.id,
      amount_cents: session.amount_total ?? null,
      currency: session.currency ?? 'usd',
    });
    if (orderErr) {
       
      console.error('order_insert_failed', orderErr.message);
      // Don't block the user — Stripe is source of truth, webhook will reconcile.
    }

    return NextResponse.json({ ok: true, mode: 'stripe', url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
     
    console.error('checkout_session_failed', msg);
    return NextResponse.json({ ok: false, error: 'checkout_failed' }, { status: 500 });
  }
}
