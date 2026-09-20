-- Countime core tables.
--
-- These are the four tables the app already writes to. None of them existed
-- anywhere as of 2026-09-20: production had no env vars at all, and
-- .env.local pointed at the WalkPerro project by mistake. Every email
-- capture on countime.net since launch returned 503 not_configured.
--
-- Apply with:  supabase link --project-ref <countime-ref> && supabase db push
--
-- RLS is enabled with no policies on purpose. The app only ever touches these
-- through the service-role key in server-only code (lib/supabase-admin.ts),
-- which bypasses RLS. Anon/public keys get nothing.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------------------------------------------------------------------------
-- subscribers: one unified list for every capture surface
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null unique,
  source      text not null default 'unknown',
  consented   boolean not null default false,
  ip_hash     text,
  user_agent  text,
  referrer    text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  constraint subscribers_source_known check (
    source in (
      'checklist',
      'prep_program_waitlist',
      'prep_program_purchase',
      'footer',
      'contact',
      'unknown'
    )
  )
);

create index if not exists subscribers_created_at_idx
  on public.subscribers (created_at desc);
create index if not exists subscribers_source_idx
  on public.subscribers (source);

-- ---------------------------------------------------------------------------
-- checklist_downloads: which subscribers actually took the free checklist
-- ---------------------------------------------------------------------------
create table if not exists public.checklist_downloads (
  id             uuid primary key default gen_random_uuid(),
  subscriber_id  uuid not null references public.subscribers (id) on delete cascade,
  format         text not null default 'print',
  version        text not null default 'v1',
  created_at     timestamptz not null default now(),
  constraint checklist_downloads_format_known check (format in ('pdf', 'print', 'html'))
);

create index if not exists checklist_downloads_subscriber_idx
  on public.checklist_downloads (subscriber_id);

-- ---------------------------------------------------------------------------
-- contact_messages: the site has no mailbox, so the form lands here
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null,
  name        text,
  topic       text,
  message     text not null,
  ip_hash     text,
  user_agent  text,
  referrer    text,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_unhandled_idx
  on public.contact_messages (created_at desc) where handled = false;

-- ---------------------------------------------------------------------------
-- program_orders: Stripe is the source of truth; this is the local mirror
-- ---------------------------------------------------------------------------
create table if not exists public.program_orders (
  id                          uuid primary key default gen_random_uuid(),
  subscriber_id               uuid references public.subscribers (id) on delete set null,
  email                       citext not null,
  plan                        text not null default 'founding_member',
  status                      text not null default 'pending',
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  stripe_customer_id          text,
  amount_cents                integer,
  currency                    text not null default 'usd',
  paid_at                     timestamptz,
  refunded_at                 timestamptz,
  created_at                  timestamptz not null default now(),
  constraint program_orders_status_known check (
    status in ('pending', 'paid', 'refunded', 'expired')
  )
);

create index if not exists program_orders_status_idx
  on public.program_orders (status, created_at desc);
create index if not exists program_orders_payment_intent_idx
  on public.program_orders (stripe_payment_intent_id);

-- ---------------------------------------------------------------------------
-- Lock everything down. Service role bypasses RLS; nothing else gets in.
-- ---------------------------------------------------------------------------
alter table public.subscribers         enable row level security;
alter table public.checklist_downloads enable row level security;
alter table public.contact_messages    enable row level security;
alter table public.program_orders      enable row level security;
