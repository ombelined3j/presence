-- Libellé : le mot « centrage » n’est plus utilisé dans les messages.
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

revoke execute on function public.validate_daily_session() from public, anon, authenticated;
