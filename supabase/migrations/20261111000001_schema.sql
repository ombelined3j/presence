-- Présence : schéma principal, relations, politiques RLS.
-- A appliquer sur un projet Supabase (SQL editor ou `supabase db push`).

create extension if not exists pgcrypto;

-- =========================================================================
-- Administrateurs
-- Table séparée de profiles : un utilisateur peut modifier son profil,
-- il ne doit pas pouvoir se promouvoir administrateur.
-- Ajout d'un admin (depuis le SQL editor uniquement) :
--   insert into public.admins (user_id) values ('<uuid de auth.users>');
-- =========================================================================
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- =========================================================================
-- 3.1 profiles
-- =========================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  reminder_time time,
  timezone text not null default 'Europe/Paris',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription (Supabase Auth).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, timezone)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'timezone', ''), 'Europe/Paris')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================================
-- 3.2 / 3.3 diagnostic
-- =========================================================================
create table public.diagnostic_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  position integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.diagnostic_questions (id) on delete cascade,
  answer_label text not null,
  reflex_type text not null
    check (reflex_type in ('avoidance', 'accommodation', 'defense', 'control', 'withdrawal')),
  score integer not null default 1 check (score between 0 and 5)
);
create index diagnostic_answers_question_idx on public.diagnostic_answers (question_id);

-- 3.4 diagnostic_results : un résultat par passage, pour suivre l'évolution.
create table public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  result_data jsonb not null default '{}'::jsonb,
  dominant_reflex text not null
    check (dominant_reflex in ('avoidance', 'accommodation', 'defense', 'control', 'withdrawal')),
  secondary_reflex text
    check (secondary_reflex in ('avoidance', 'accommodation', 'defense', 'control', 'withdrawal')),
  completed_at timestamptz not null default now()
);
create index diagnostic_results_user_idx on public.diagnostic_results (user_id, completed_at desc);

-- =========================================================================
-- 3.5 audio_exercises + programmation
-- =========================================================================
create table public.audio_exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  audio_url text not null,
  category text not null default 'centering',
  duration_seconds integer not null check (duration_seconds > 0),
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Programmation optionnelle par date. Sans programmation pour un jour donné,
-- l'application propose une rotation sur les audios actifs (voir services/sessions.ts).
create table public.audio_schedule (
  id uuid primary key default gen_random_uuid(),
  scheduled_date date not null unique,
  exercise_id uuid not null references public.audio_exercises (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- 3.6 daily_sessions
-- source : 'daily' (séance du jour) ou 'focus' (réécoute libre depuis Focus).
-- =========================================================================
create table public.daily_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_id uuid references public.audio_exercises (id) on delete set null,
  session_date date not null,
  mode text not null check (mode in ('centering', 'difficult_situation')),
  source text not null default 'daily' check (source in ('daily', 'focus')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  status text not null default 'started' check (status in ('started', 'completed', 'interrupted')),
  created_at timestamptz not null default now()
);
create index daily_sessions_user_date_idx on public.daily_sessions (user_id, session_date desc);

-- Une séance d’ancrage n'est "terminée" que si l'écoute réelle couvre
-- au moins 90 % de la durée prévue. Vérifié côté base, pas seulement dans l'interface.
create or replace function public.validate_daily_session()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  expected integer;
begin
  -- L'heure de début est fixée par le serveur, jamais par le client.
  if tg_op = 'INSERT' then
    new.started_at = now();
  else
    new.started_at = old.started_at;
  end if;

  if new.status = 'completed' then
    if new.mode = 'centering' then
      select duration_seconds into expected from public.audio_exercises where id = new.exercise_id;
      if expected is null then
        raise exception 'Séance sans audio associé';
      end if;
      -- Double vérification : durée d'écoute déclarée ET temps réellement écoulé.
      if new.duration_seconds < floor(expected * 0.9)
         or extract(epoch from (now() - new.started_at)) < floor(expected * 0.9) then
        raise exception 'Écoute insuffisante pour terminer la séance (écoute déclarée : % s, attendu : au moins % s)', new.duration_seconds, floor(expected * 0.9);
      end if;
    end if;
    if new.completed_at is null then
      new.completed_at = now();
    end if;
  else
    new.completed_at = null;
  end if;
  -- Une séance terminée ne repasse pas à un autre statut.
  if tg_op = 'UPDATE' and old.status = 'completed' and new.status <> 'completed' then
    raise exception 'Une séance terminée ne peut pas être modifiée';
  end if;
  return new;
end;
$$;

create trigger daily_sessions_validate
before insert or update on public.daily_sessions
for each row execute function public.validate_daily_session();

-- =========================================================================
-- 3.7 difficult_situations
-- context : 'preparation' (séance du jour), 'focus' ou 'sos'.
-- =========================================================================
create table public.difficult_situations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  description text not null,
  person_involved text,
  main_concern text,
  emotional_state text,
  context text not null default 'preparation' check (context in ('preparation', 'focus', 'sos')),
  preparation_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index difficult_situations_user_idx on public.difficult_situations (user_id, created_at desc);

-- =========================================================================
-- 3.8 exercises (Dojo, Focus) et 3.9 exercise_completions
-- =========================================================================
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  content jsonb not null default '{}'::jsonb,
  estimated_duration integer not null default 5,
  difficulty_level text not null default 'debutant'
    check (difficulty_level in ('debutant', 'intermediaire', 'avance')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.exercise_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  completed_at timestamptz not null default now(),
  result_data jsonb not null default '{}'::jsonb
);
create index exercise_completions_user_idx on public.exercise_completions (user_id, completed_at desc);

-- =========================================================================
-- Suppression de compte par l'utilisateur lui-même (gestion des données).
-- Supprime auth.users, les données suivent par cascade.
-- =========================================================================
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non authentifié';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- =========================================================================
-- 3.10 Row Level Security
-- =========================================================================
alter table public.admins enable row level security;
alter table public.profiles enable row level security;
alter table public.diagnostic_questions enable row level security;
alter table public.diagnostic_answers enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.audio_exercises enable row level security;
alter table public.audio_schedule enable row level security;
alter table public.daily_sessions enable row level security;
alter table public.difficult_situations enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_completions enable row level security;

-- admins : chacun peut seulement vérifier s'il est admin. Aucune écriture via l'API.
create policy "admins_select_self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- profiles
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- diagnostic_questions / answers : lisibles sans compte (le diagnostic est public).
create policy "diag_questions_public_read" on public.diagnostic_questions
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "diag_questions_admin_write" on public.diagnostic_questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "diag_answers_public_read" on public.diagnostic_answers
  for select to anon, authenticated using (
    exists (
      select 1 from public.diagnostic_questions q
      where q.id = question_id and (q.is_active or public.is_admin())
    )
  );
create policy "diag_answers_admin_write" on public.diagnostic_answers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- diagnostic_results
create policy "diag_results_select_own" on public.diagnostic_results
  for select to authenticated using (user_id = auth.uid());
create policy "diag_results_insert_own" on public.diagnostic_results
  for insert to authenticated with check (user_id = auth.uid());
create policy "diag_results_delete_own" on public.diagnostic_results
  for delete to authenticated using (user_id = auth.uid());

-- audio_exercises
create policy "audio_read_active" on public.audio_exercises
  for select to authenticated using (is_active or public.is_admin());
create policy "audio_admin_write" on public.audio_exercises
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- audio_schedule
create policy "schedule_read" on public.audio_schedule
  for select to authenticated using (true);
create policy "schedule_admin_write" on public.audio_schedule
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- daily_sessions
create policy "sessions_select_own" on public.daily_sessions
  for select to authenticated using (user_id = auth.uid());
create policy "sessions_insert_own" on public.daily_sessions
  for insert to authenticated with check (user_id = auth.uid());
create policy "sessions_update_own" on public.daily_sessions
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "sessions_delete_own" on public.daily_sessions
  for delete to authenticated using (user_id = auth.uid());

-- difficult_situations
create policy "situations_select_own" on public.difficult_situations
  for select to authenticated using (user_id = auth.uid());
create policy "situations_insert_own" on public.difficult_situations
  for insert to authenticated with check (user_id = auth.uid());
create policy "situations_update_own" on public.difficult_situations
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "situations_delete_own" on public.difficult_situations
  for delete to authenticated using (user_id = auth.uid());

-- exercises
create policy "exercises_read_active" on public.exercises
  for select to authenticated using (is_active or public.is_admin());
create policy "exercises_admin_write" on public.exercises
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- exercise_completions
create policy "completions_select_own" on public.exercise_completions
  for select to authenticated using (user_id = auth.uid());
create policy "completions_insert_own" on public.exercise_completions
  for insert to authenticated with check (user_id = auth.uid());
create policy "completions_delete_own" on public.exercise_completions
  for delete to authenticated using (user_id = auth.uid());
