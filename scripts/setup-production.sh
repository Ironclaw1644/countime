#!/usr/bin/env bash
#
# Countime production setup — run once. Idempotent, safe to re-run.
#
# THE ACTUAL PROBLEM (diagnosed 2026-09-25):
#   countime.net has been live since 2026-08-23 with ZERO environment variables
#   on Vercel, so every email capture returns 503 not_configured. Meanwhile:
#     - The database was never missing. countime.subscribers and friends have
#       existed all along on the WalkPerro Supabase project, in the `countime`
#       schema, already exposed to PostgREST, with their own countime_secret key.
#     - lib/supabase-admin.ts read SUPABASE_SERVICE_ROLE_KEY while .env.local and
#       this script both write SUPABASE_SECRET_KEY, so isSupabaseConfigured()
#       returned false no matter what. Fixed to accept either name.
#
#   The 2026-09-20 version of this script would have failed even on a perfect
#   run: it created a new Supabase project, pushed tables into `public`, and set
#   a variable the code did not read. No new project is needed. No Pro plan is
#   needed. Supabase Free allows 2 active projects per ACCOUNT and this account
#   already has 2 (short-it, WalkPerro), which is where the phantom "$10/mo Pro"
#   requirement came from.
#
# What this does:
#   1. Reads the three values from .env.local (they are already correct)
#   2. Pushes them to Vercel production, without printing them
#   3. Redeploys and verifies the live capture endpoint returns 200
#   4. Tells you how to delete the verification row
#
# Deliberately does NOT set any Stripe variable. The $299 Surrender Prep
# Companion advertised on /prep-program has no content built yet, so the site
# should keep degrading to the waitlist flow until it does.
#
# Usage: ./scripts/setup-production.sh

set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env.local ]]; then
  echo "error: .env.local not found. It holds the values this script copies." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; . ./.env.local; set +a

: "${NEXT_PUBLIC_SUPABASE_URL:?NEXT_PUBLIC_SUPABASE_URL missing from .env.local}"
: "${SUPABASE_SECRET_KEY:?SUPABASE_SECRET_KEY missing from .env.local}"
IP_HASH_SALT="${IP_HASH_SALT:-$(openssl rand -hex 32)}"

echo "==> Sanity check: can we actually reach countime.subscribers?"
PROBE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/subscribers?select=id&limit=1" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
  -H "Accept-Profile: countime")
if [[ "$PROBE" != "200" ]]; then
  echo "    RED: schema probe returned HTTP $PROBE, expected 200." >&2
  echo "    Do not push env vars yet — fix the database access first." >&2
  exit 1
fi
echo "    OK: countime schema reachable."

echo "==> Pushing Vercel production env vars (values never echoed)"
push_env() {
  local name="$1" value="$2"
  # Remove any existing value first so re-runs update rather than collide.
  vercel env rm "$name" production --yes >/dev/null 2>&1 || true
  printf '%s' "$value" | vercel env add "$name" production >/dev/null
  echo "    set $name"
}
push_env NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL"
push_env SUPABASE_SECRET_KEY      "$SUPABASE_SECRET_KEY"
push_env IP_HASH_SALT             "$IP_HASH_SALT"

echo "==> Redeploying production"
vercel --prod --yes

echo "==> Verifying the live capture endpoint"
sleep 5
CODE=$(curl -s -o /tmp/countime-verify.json -w '%{http_code}' --max-time 30 \
  -X POST https://countime.net/api/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"setup-check@countime.net","consented":true,"source":"checklist"}')

echo "    POST /api/subscribe -> HTTP $CODE"
cat /tmp/countime-verify.json; echo

if [[ "$CODE" == "200" ]]; then
  echo
  echo "GREEN. Capture is live. Delete the check row:"
  echo "  curl -X DELETE \"\$NEXT_PUBLIC_SUPABASE_URL/rest/v1/subscribers?email=eq.setup-check@countime.net\" \\"
  echo "    -H \"apikey: \$SUPABASE_SECRET_KEY\" -H \"Authorization: Bearer \$SUPABASE_SECRET_KEY\" \\"
  echo "    -H 'Content-Profile: countime'"
else
  echo
  echo "RED. Still not capturing. Check: vercel logs countime.net"
  exit 1
fi
