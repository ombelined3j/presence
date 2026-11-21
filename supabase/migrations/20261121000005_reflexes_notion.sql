-- Diagnostic : les 5 réflexes relationnels de la page Notion « Contenu de l’app ».
-- withdraw = Me retirer, endure = Endurer, overadapt = Me suradapter, impose = M’imposer, conform = Me conformer.
-- Le questionnaire est désormais défini dans le code (src/data/diagnostic.ts) ; les tables
-- diagnostic_questions / diagnostic_answers ne sont plus lues par l’app.

alter table public.diagnostic_results drop constraint if exists diagnostic_results_dominant_reflex_check;
alter table public.diagnostic_results drop constraint if exists diagnostic_results_secondary_reflex_check;

-- Anciens résultats : correspondance la plus proche vers les nouveaux réflexes.
update public.diagnostic_results set dominant_reflex = case dominant_reflex
  when 'avoidance' then 'withdraw' when 'withdrawal' then 'endure' when 'accommodation' then 'overadapt'
  when 'defense' then 'impose' when 'control' then 'conform' else dominant_reflex end;
update public.diagnostic_results set secondary_reflex = case secondary_reflex
  when 'avoidance' then 'withdraw' when 'withdrawal' then 'endure' when 'accommodation' then 'overadapt'
  when 'defense' then 'impose' when 'control' then 'conform' else secondary_reflex end
  where secondary_reflex is not null;

alter table public.diagnostic_results add constraint diagnostic_results_dominant_reflex_check
  check (dominant_reflex in ('withdraw', 'endure', 'overadapt', 'impose', 'conform'));
alter table public.diagnostic_results add constraint diagnostic_results_secondary_reflex_check
  check (secondary_reflex in ('withdraw', 'endure', 'overadapt', 'impose', 'conform'));
