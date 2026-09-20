#!/usr/bin/env bash
#
# Countime production setup — run once, after creating the countime Supabase project.
#
# Fixes the state found on 2026-09-20: countime.net had been live for 27 days
# with zero environment variables on Vercel and no database anywhere, so every
# email capture returned 503 not_configured.
#
# What this does:
#   1. Applies supabase/migrations/0001_countime_core.sql to the countime project
#   2. Pushes the three required env vars to Vercel production
#   3. Redeploys and verifies the live capture endpoint actually returns 200
#
# Deliberately does NOT set any Stripe variable. The $299 Surrender Prep
# Companion advertised on /prep-program has no content built yet, so the site
# should keep degrading to the waitlist flow until it does.
#
# Usage: ./scripts/setup-production.sh <countime-project-ref>

set -euo pipefail

REF="${1:-}"
if [[ -z "$REF" ]]; then
  echo "usage: $0 <countime-supabase-project-ref>" >&2
  exit 1
fi

cd "$(dirname "$0")/.."

echo "==> Linking Supabase project $REF"
supabase link --project-ref "$REF"

echo "==> Applying migrations"
supabase db push

echo
echo "==> Vercel production env vars"
echo "    Paste each value when prompted (input is not echoed to the terminal)."
echo "    Get them from: https://supabase.com/dashboard/project/$REF/settings/api"
echo

read -rsp "NEXT_PUBLIC_SUPABASE_URL (https://$REF.supabase.co): " SUPA_URL; echo
read -rsp "SUPABASE_SECRET_KEY (service_role key): " SUPA_KEY; echo

# A fresh random salt. IP hashes are only ever compared within one site, so a
# new salt is fine; it just means pre-existing hashes (there are none) reset.
SALT="$(openssl rand -hex 32)"

printf '%s' "${SUPA_URL:-https://$REF.supabase.co}" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
printf '%s' "$SUPA_KEY" | vercel env add SUPABASE_SECRET_KEY production
printf '%s' "$SALT"     | vercel env add IP_HASH_SALT production

unset SUPA_KEY SALT

echo "==> Redeploying production"
vercel --prod

echo
echo "==> Verifying the live capture endpoint"
sleep 5
CODE=$(curl -s -o /tmp/countime-verify.json -w '%{http_code}' \
  -X POST https://countime.net/api/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"setup-check@countime.net","consented":true,"source":"checklist"}')

echo "    POST /api/subscribe -> HTTP $CODE"
cat /tmp/countime-verify.json; echo

if [[ "$CODE" == "200" ]]; then
  echo
  echo "GREEN. Capture is live. Now delete the check row:"
  echo "  https://supabase.com/dashboard/project/$REF/editor  ->  subscribers"
else
  echo
  echo "RED. Still not capturing. Check: vercel logs countime.net"
  exit 1
fi
