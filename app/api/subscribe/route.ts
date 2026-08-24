import { NextRequest, NextResponse } from 'next/server';
import {
  upsertSubscriber,
  logChecklistDownload,
  isValidEmail,
  type SubscriberSource,
} from '@/lib/subscribers';
import { isSupabaseConfigured } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_SOURCES: SubscriberSource[] = [
  'checklist',
  'prep_program_waitlist',
  'footer',
  'contact',
];

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const body = payload as {
    email?: unknown;
    source?: unknown;
    consented?: unknown;
    metadata?: unknown;
  };

  const email = typeof body.email === 'string' ? body.email : '';
  const source = (typeof body.source === 'string' && (VALID_SOURCES as string[]).includes(body.source)
    ? body.source
    : 'unknown') as SubscriberSource;
  const consented = body.consented === true;
  const metadata =
    body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
      ? (body.metadata as Record<string, unknown>)
      : {};

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  // Trust proxies on Vercel; fall back to direct IP.
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null;
  const userAgent = req.headers.get('user-agent');
  const referrer = req.headers.get('referer');

  try {
    const subscriber = await upsertSubscriber({
      email,
      source,
      consented,
      ip,
      userAgent,
      referrer,
      metadata,
    });

    // If this was a checklist signup, log the download event too.
    if (source === 'checklist') {
      await logChecklistDownload(subscriber.id, 'print', 'v1');
    }

    return NextResponse.json({ ok: true, subscriberId: subscriber.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
     
    console.error('subscribe_failed', msg);
    return NextResponse.json(
      { ok: false, error: 'server_error' },
      { status: 500 },
    );
  }
}
