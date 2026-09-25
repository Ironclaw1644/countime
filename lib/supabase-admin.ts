/**
 * Server-only Supabase admin client.
 *
 * Uses the service_role key, which bypasses RLS. Never import this from a
 * client component. The `import 'server-only'` line at the top will make any
 * accidental client import fail at build time.
 *
 * The Countime tables live in the `countime` schema on the WalkPerro project.
 * Default API requests go through PostgREST, but we restrict the `countime`
 * schema to service_role only, so calls must be made server-side from here.
 */
import 'server-only';
import { createClient } from '@supabase/supabase-js';

// The schema-typed client returned by createClient with `db.schema = 'countime'`
// is not assignable to the default-typed SupabaseClient. We let TypeScript
// infer the return type by not annotating the cache + return.
type CountimeAdmin = ReturnType<typeof createCountimeAdmin>;

let _admin: CountimeAdmin | null = null;

/**
 * The server-side key, under either name.
 *
 * Supabase is migrating from legacy `service_role` JWTs to the newer
 * `sb_secret_…` API keys, and the two live under different env var names in
 * the wild. This file used to read `SUPABASE_SERVICE_ROLE_KEY` only, while
 * every env file and setup script here writes `SUPABASE_SECRET_KEY` — so
 * `isSupabaseConfigured()` returned false even with a perfectly good key
 * present, and every capture 503'd. Accept both names.
 */
function secretKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function projectUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
}

function createCountimeAdmin() {
  const url = projectUrl();
  const serviceRoleKey = secretKey();

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) is not set');
  }
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) is not set');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'countime' },
  });
}

/**
 * Whether the Supabase credentials are present.
 *
 * Checked before every write so that a site deployed without them degrades to
 * an honest "this isn't switched on yet" message instead of a 500 — these
 * forms are used by people in the middle of a crisis, and a crash is the worst
 * possible answer.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(projectUrl() && secretKey());
}

export function supabaseAdmin(): CountimeAdmin {
  if (_admin) return _admin;
  _admin = createCountimeAdmin();
  return _admin;
}
