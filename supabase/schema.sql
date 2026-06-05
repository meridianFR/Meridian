-- ───────────────────────────────────────────────────────────────────────────
-- Meridian — schéma Supabase (comptes + abonnements)
-- À coller dans : Supabase → SQL Editor → New query → Run.
-- Idempotent : peut être relancé sans danger.
-- ───────────────────────────────────────────────────────────────────────────

-- 1) PROFILS ------------------------------------------------------------------
-- Une ligne par utilisateur, liée à auth.users. Stocke l'ID client Stripe.
create table if not exists public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text,
  stripe_customer_id text unique,
  created_at         timestamptz not null default now()
);

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

-- 2) ABONNEMENTS --------------------------------------------------------------
-- Une ligne par utilisateur (upsert sur user_id). Reflète l'état Stripe.
create table if not exists public.subscriptions (
  user_id                uuid primary key references auth.users (id) on delete cascade,
  stripe_subscription_id text,
  stripe_customer_id     text,
  status                 text not null default 'incomplete',
  price_id               text,
  plan                   text,            -- 'monthly' | 'annual'
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

-- 3) RLS ----------------------------------------------------------------------
-- Lecture : chacun ne voit QUE ses propres lignes.
-- Écriture : AUCUNE depuis le client — seul le service role (webhook) écrit,
-- et il contourne la RLS. C'est volontaire (anti-fraude).
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "subscriptions: select own" on public.subscriptions;
create policy "subscriptions: select own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- 4) CRÉATION AUTO DU PROFIL À L'INSCRIPTION ----------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
