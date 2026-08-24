/**
 * Helpers for inserting / upserting email subscribers on the server side.
 *
 * Every public-facing path (checklist email gate, prep-program waitlist,
 * prep-program checkout intake) routes through `upsertSubscriber`. This way
 * the `countime.subscribers` table is a single, unified list.
 */
import 'server-only';
import { createHash } from 'crypto';
import { supabaseAdmin } from './supabase-admin';

export type SubscriberSource =
  | 'checklist'
  | 'prep_program_waitlist'
  | 'prep_program_purchase'
  | 'footer'
  | 'contact'
  | 'unknown';

export interface UpsertSubscriberInput {
  email: string;
  source: SubscriberSource;
  consented: boolean;
  ip?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  metadata?: Record<string, unknown>;
}

export interface SubscriberRow {
  id: string;
  email: string;
  source: string;
  consented: boolean;
  created_at: string;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim();
  if (e.length > 254) return false;
  return EMAIL_RX.test(e);
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? 'countime-default-salt';
  return createHash('sha256').update(`${salt}|${ip}`).digest('hex');
}

/**
 * Insert a subscriber if new; if email already exists, leave the original
 * row alone but optionally update source if a higher-intent surface just
 * captured them. Returns the row.
 */
export async function upsertSubscriber(
  input: UpsertSubscriberInput,
): Promise<SubscriberRow> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new Error('invalid_email');
  }

  const admin = supabaseAdmin();

  // First try insert
  const { data: inserted, error: insertErr } = await admin
    .from('subscribers')
    .insert({
      email,
      source: input.source,
      consented: input.consented,
      ip_hash: hashIp(input.ip),
      user_agent: input.userAgent ?? null,
      referrer: input.referrer ?? null,
      metadata: input.metadata ?? {},
    })
    .select('id, email, source, consented, created_at')
    .single();

  if (!insertErr && inserted) {
    return inserted as SubscriberRow;
  }

  // If conflict (duplicate email), fetch the existing row.
  // Postgres error code 23505 is unique_violation.
  const errMaybe = (insertErr as unknown) as { code?: string } | null;
  if (errMaybe?.code === '23505') {
    const { data: existing, error: selectErr } = await admin
      .from('subscribers')
      .select('id, email, source, consented, created_at')
      .eq('email', email)
      .single();

    if (selectErr || !existing) {
      throw new Error(`subscriber_lookup_failed: ${selectErr?.message}`);
    }
    return existing as SubscriberRow;
  }

  throw new Error(`subscriber_insert_failed: ${insertErr?.message}`);
}

export async function logChecklistDownload(
  subscriberId: string,
  format: 'pdf' | 'print' | 'html' = 'print',
  version: string = 'v1',
): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin
    .from('checklist_downloads')
    .insert({ subscriber_id: subscriberId, format, version });
  if (error) {
    // Log only; don't fail the user flow because we couldn't write a row.
     
    console.error('checklist_download_log_failed', error.message);
  }
}

export interface ContactMessageInput {
  email: string;
  name?: string | null;
  topic?: string | null;
  message: string;
  ip?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}

/**
 * Stores a message from the contact form.
 *
 * The site has no mailbox yet — countime.net was registered recently and the
 * previous `hello@countime.com` links pointed at a domain we do not own — so
 * messages land in `countime.contact_messages` rather than an inbox. The
 * sender is also added to `subscribers` so a reply path exists.
 */
export async function saveContactMessage(input: ContactMessageInput): Promise<void> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) throw new Error('invalid_email');
  const message = input.message.trim();
  if (!message) throw new Error('empty_message');

  const admin = supabaseAdmin();
  const { error } = await admin.from('contact_messages').insert({
    email,
    name: input.name?.trim() || null,
    topic: input.topic?.trim() || null,
    message: message.slice(0, 8000),
    ip_hash: hashIp(input.ip),
    user_agent: input.userAgent ?? null,
    referrer: input.referrer ?? null,
  });
  if (error) throw new Error(`contact_insert_failed: ${error.message}`);
}
