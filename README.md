# Présence

Application web mobile-first d'entraînement quotidien aux conversations difficiles.
React + TypeScript + Tailwind CSS + Supabase (Vite).

## Démarrer

```bash
npm install
npm run dev
```

La configuration Supabase publique est dans `.env` (versionné). Un `.env.local` peut la surcharger.

Sans configuration, la landing page et le diagnostic fonctionnent (questions de secours locales) ; la connexion et les données non.

## Base de données

Appliquer dans l'ordre, sur le projet Supabase (SQL editor ou `supabase db push`) :

1. `supabase/migrations/20261111000001_schema.sql` : tables, relations, déclencheurs, RLS.
2. `supabase/migrations/20261111000002_seed.sql` : 5 audios, diagnostic, 6 scénarios Dojo.
3. `supabase/migrations/20261111000003_harden_functions.sql` : droits sur les fonctions (linter Supabase).

Ces trois migrations sont déjà appliquées sur le projet `sfsuidbbitepqsxygogx`.

Le seed est généré depuis `src/data/*.ts` : `node --experimental-strip-types scripts/generate-seed.mjs`.

Nommer un administrateur (accès à `/admin` pour gérer audios et programmation) :

```sql
insert into public.admins (user_id) values ('<uuid de auth.users>');
```

## Points d'architecture

- Séance terminée seulement si l'écoute réelle atteint 90 % de la durée prévue : contrôlé dans le lecteur ET en base (trigger `validate_daily_session`, qui vérifie aussi le temps écoulé côté serveur).
- Audio du jour : programmation par date (`audio_schedule`), sinon rotation sur les audios actifs.
- Rappels : heure et fuseau enregistrés ; aucun envoi tant qu'aucun canal n'est branché (`src/services/notifications.ts`).
- IA : `src/services/preparationEngine.ts` expose une interface `PreparationProvider` (implémentation locale par règles aujourd'hui).

## Scripts

- `npm run build` : vérification TypeScript + build
- `npm test` : tests unitaires (Vitest)
