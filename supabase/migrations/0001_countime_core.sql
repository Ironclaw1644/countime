-- Countime core tables, in the `countime` schema.
--
-- READ THIS BEFORE RUNNING IT.
--
-- These tables ALREADY EXIST on the WalkPerro Supabase project
-- (ref kflzqkuioiiyfrvlvcvl), in the `countime` schema, which is already in
-- that project's exposed-schemas list and already has its own
-- `countime_secret` API key. Verified live on 2026-09-25: all four tables
-- return 200 through PostgREST with `Accept-Profile: countime`.
--
-- That is the house pattern here, not an accident: one Postgres project, one
-- schema per site, one secret key per site. Roughly two dozen other sites in
-- this account are set up the same way.
--
-- So this file is a no-op against production and exists for two reasons:
--   1. To bootstrap a fresh environment from nothing.
--   2. To stop the previous version of this file from doing damage. It created
--      these tables in `public` on a brand-new standalone project, which was
--      based on a misdiagnosis on 2026-09-20 ("no DB anywhere, env pointed at
--      WalkPerro by mistake"). The env var was correct. Pushing that version
--      would have created a second, empty, shadow copy of every table in the
--      wrong schema while the real ones sat there working.
--
-- Column names and types below were reconstructed from the live schema by
-- PostgREST introspection, so treat them as faithful but not byte-exact for
-- defaults and constraints. Everything is `if not exists`, so applying this
-- against the live project changes nothing.
--
-- Apply with:  supabase link --project-ref kflzqkuioiiyfrvlvcvl && supabase db push

create schema if not exists countime;

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- subscribers: one unified list for every capture surface
-- ---------------------------------------------------------------------------
create table if not exists countime.subscribers (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  -- Capture surface. Deliberately NOT a CHECK constraint: the app sends
  -- prep_program_waitlist and prep_program_purchase, which an older, narrower
  -- constraint would have rejected. Verified unconstrained on 2026-09-25.
  source           text not null default 'unknown',
  consented        boolean not null default false,
  ip_hash          text,
  user_agent       text,
  referrer         text,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unsubscribed_at  timestamptz
);

create index if not exists subscribers_created_at_idx
  on countime.subscribers (created_at desc);
create index if not exists subscribers_source_idx
  on countime.subscribers (source);

-- ---------------------------------------------------------------------------
-- checklist_downloads: which subscribers actually took the free checklist
-- ---------------------------------------------------------------------------
create table if not exists countime.checklist_downloads (
  id             uuid primary key default gen_random_uuid(),
  subscriber_id  uuid not null references countime.subscribers (id) on delete cascade,
  format         text not null default 'print',
  version        text not null default 'v1',
  created_at     timestamptz not null default now()
);

create index if not exists checklist_downloads_subscriber_idx
  on countime.checklist_downloads (subscriber_id);

-- ---------------------------------------------------------------------------
-- contact_messages: the site has no mailbox, so the form lands here
-- ---------------------------------------------------------------------------
create table if not exists countime.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  name        text,
  topic       text,
  message     text not null,
  ip_hash     text,
  user_agent  text,
  referrer    text,
  handled_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_unhandled_idx
  on countime.contact_messages (created_at desc) where handled_at is null;

-- ---------------------------------------------------------------------------
-- program_orders: Stripe is the source of truth; this is the local mirror
-- ---------------------------------------------------------------------------
create table if not exists countime.program_orders (
  id                          uuid primary key default gen_random_uuid(),
  subscriber_id               uuid references countime.subscribers (id) on delete set null,
  email                       text not null,
  plan                        text not null default 'founding_member',
  status                      text not null default 'pending',
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  stripe_customer_id          text,
  amount_cents                integer,
  currency                    text not null default 'usd',
  metadata                    jsonb not null default '{}'::jsonb,
  created_at                  timestamptz not null default now(),
  paid_at                     timestamptz,
  refunded_at                 timestamptz
);

create index if not exists program_orders_status_idx
  on countime.program_orders (status, created_at desc);
create index if not exists program_orders_payment_intent_idx
  on countime.program_orders (stripe_payment_intent_id);

-- ---------------------------------------------------------------------------
-- Lock everything down. Service role bypasses RLS; nothing else gets in.
-- ---------------------------------------------------------------------------
alter table countime.subscribers         enable row level security;
alter table countime.checklist_downloads enable row level security;
alter table countime.contact_messages    enable row level security;
alter table countime.program_orders      enable row level security;
