-- Migration: 20251016094842_init_core_schema
-- Description: Initialize core schema (profiles, characters, tasks, streaks, transactions, habit_logs) with RLS policies and enums.
-- Notes:
-- - Mirrors the DDL previously applied via MCP.
-- - Safe to run multiple times thanks to IF NOT EXISTS checks.
-- - Requires pgcrypto for gen_random_uuid().

-- Enable needed extensions
create extension if not exists pgcrypto;

-- ================================
-- PROFILES
-- ================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- RLS policies for profiles
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own'
  ) then
    create policy profiles_select_own on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_insert_own'
  ) then
    create policy profiles_insert_own on public.profiles
      for insert with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own'
  ) then
    create policy profiles_update_own on public.profiles
      for update using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_delete_own'
  ) then
    create policy profiles_delete_own on public.profiles
      for delete using (auth.uid() = id);
  end if;
end$$;

-- ================================
-- CHARACTERS
-- ================================
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  level int not null default 1,
  xp int not null default 0,
  hp int not null default 100,
  gold int not null default 0,
  theme text not null default 'default',
  avatar_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_characters_user_id on public.characters(user_id);
alter table public.characters enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'characters' and policyname = 'characters_rw_own'
  ) then
    create policy characters_rw_own on public.characters
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

-- ================================
-- ENUMS
-- ================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_type') then
    create type task_type as enum ('habit','daily','todo');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_difficulty') then
    create type task_difficulty as enum ('trivial','easy','medium','hard');
  end if;
end$$;

-- ================================
-- TASKS
-- ================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type task_type not null,
  title text not null,
  description text,
  difficulty task_difficulty not null default 'easy',
  is_completed boolean not null default false,
  due_date timestamptz,
  repeat_pattern jsonb,
  checklist jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_created_at on public.tasks(created_at desc);
alter table public.tasks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'tasks' and policyname = 'tasks_rw_own'
  ) then
    create policy tasks_rw_own on public.tasks
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

-- ================================
-- STREAKS
-- ================================
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_completed_date date
);
create index if not exists idx_streaks_user_id on public.streaks(user_id);
alter table public.streaks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'streaks' and policyname = 'streaks_rw_own'
  ) then
    create policy streaks_rw_own on public.streaks
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

-- ================================
-- TRANSACTIONS
-- ================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  amount int not null,
  source text not null,
  source_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
alter table public.transactions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_rw_own'
  ) then
    create policy transactions_rw_own on public.transactions
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

-- ================================
-- HABIT LOGS (optional)
-- ================================
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_positive boolean not null,
  logged_at timestamptz not null default now()
);
alter table public.habit_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'habit_logs' and policyname = 'habit_logs_rw_own'
  ) then
    create policy habit_logs_rw_own on public.habit_logs
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end$$;

-- ================================
-- PostgREST schema cache reload
-- ================================
select pg_notify('pgrst', 'reload schema');
