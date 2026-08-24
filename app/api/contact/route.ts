import { NextRequest, NextResponse } from 'next/server';
import { saveContactMessage, upsertSubscriber, isValidEmail } from '@/lib/subscribers';
import { isSupabaseConfigured } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_MESSAGE = 8000;

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const body = payload as {
    email?: unknown;
    name?: unknown;
    topic?: unknown;
    message?: unknown;
    consented?: unknown;
    company?: unknown;
  };

  // Honeypot: a field no human sees, so anything filling it is a bot. Answer
  // 200 so the bot has nothing to learn from the response.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email : '';
  const message = typeof body.message === 'string' ? body.message : '';
  const name = typeof body.name === 'string' ? body.name : null;
  const topic = typeof body.topic === 'string' ? body.topic : null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!message.trim()) {
    return NextResponse.json({ ok: false, error: 'empty_message' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ ok: false, error: 'message_too_long' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null;
  const userAgent = req.headers.get('user-agent');
  const referrer = req.headers.get('referer');

  try {
    await saveContactMessage({ email, name, topic, message, ip, userAgent, referrer });

    // Keeping the sender on the subscriber list is what makes a reply
    // possible at all while there is no mailbox; failure here must not lose
    // the message that was already stored.
    if (body.consented === true) {
      try {
        await upsertSubscriber({
          email,
          source: 'contact',
          consented: true,
          ip,
          userAgent,
          referrer,
          metadata: { topic },
        });
      } catch (err) {
         
        console.error('contact_subscribe_failed', err instanceof Error ? err.message : 'unknown');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
     
    console.error('contact_failed', msg);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
