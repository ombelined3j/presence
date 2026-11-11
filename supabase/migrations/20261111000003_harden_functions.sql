-- Durcissement suite aux avertissements du linter Supabase.

-- Fonctions de déclencheur : jamais appelables via l'API (les triggers continuent de fonctionner).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.validate_daily_session() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- is_admin() : réservé aux utilisateurs connectés (utile aux politiques RLS ; ne renvoie que son propre statut).
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Lecture publique du diagnostic sans dépendre de is_admin() pour anon.
drop policy "diag_questions_public_read" on public.diagnostic_questions;
create policy "diag_questions_anon_read" on public.diagnostic_questions
  for select to anon using (is_active);
create policy "diag_questions_auth_read" on public.diagnostic_questions
  for select to authenticated using (is_active or public.is_admin());

drop policy "diag_answers_public_read" on public.diagnostic_answers;
create policy "diag_answers_anon_read" on public.diagnostic_answers
  for select to anon using (
    exists (select 1 from public.diagnostic_questions q where q.id = question_id and q.is_active)
  );
create policy "diag_answers_auth_read" on public.diagnostic_answers
  for select to authenticated using (
    exists (select 1 from public.diagnostic_questions q where q.id = question_id and (q.is_active or public.is_admin()))
  );
