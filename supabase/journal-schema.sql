-- ───────────────────────────────────────────────────────────────────────────
-- Meridian Journal — schéma des données du journal (par utilisateur)
-- À exécuter APRÈS schema.sql, dans : Supabase → SQL Editor → New query → Run.
-- Idempotent : peut être relancé sans danger.
--
-- Modèle de sécurité : RLS stricte. Chaque utilisateur ne voit et ne modifie
-- QUE ses propres lignes (auth.uid() = user_id), en lecture comme en écriture.
-- ───────────────────────────────────────────────────────────────────────────

-- 1) COMPTES DE TRADING --------------------------------------------------------
create table if not exists public.accounts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);
create index if not exists accounts_user_idx on public.accounts (user_id);

-- 2) SETUPS PERSONNELS ---------------------------------------------------------
create table if not exists public.setups (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);
create index if not exists setups_user_idx on public.setups (user_id);

-- 3) TRADES --------------------------------------------------------------------
-- traded_at = heure « horloge » du broker (sans fuseau), source de vérité
-- temporelle pour l'analyse par heure / jour.
create table if not exists public.trades (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  account_id   uuid not null references public.accounts (id) on delete cascade,
  traded_at    timestamp not null,
  instrument   text not null,
  direction    text not null check (direction in ('long', 'short')),
  r            numeric not null default 0,
  setup        text not null default '',
  flag         text not null default 'conforme' check (flag in ('conforme', 'partiel', 'horsplan')),
  entry        numeric not null default 0,
  exit         numeric not null default 0,
  size         numeric not null default 0,
  tags         text[] not null default '{}',
  emotion      int not null default 3 check (emotion between 1 and 5),
  note         text not null default '',
  duration_min int,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists trades_user_account_idx on public.trades (user_id, account_id, traded_at desc);

-- 4) REVUES HEBDO --------------------------------------------------------------
create table if not exists public.weekly_reviews (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  account_id      uuid not null references public.accounts (id) on delete cascade,
  week_start      date not null,
  answers         jsonb not null default '{}'::jsonb,
  discipline_score int,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, account_id, week_start)
);
create index if not exists weekly_reviews_user_idx on public.weekly_reviews (user_id, account_id);

-- 5) RLS — chacun chez soi ----------------------------------------------------
alter table public.accounts        enable row level security;
alter table public.setups          enable row level security;
alter table public.trades          enable row level security;
alter table public.weekly_reviews  enable row level security;

-- Helper : (re)crée une policy « propriétaire » couvrant select/insert/update/delete.
do $$
declare
  t text;
begin
  foreach t in array array['accounts', 'setups', 'trades', 'weekly_reviews']
  loop
    execute format('drop policy if exists %I on public.%I', t || '_owner', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t || '_owner', t
    );
  end loop;
end $$;
