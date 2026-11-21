// Génère supabase/migrations/20261111000002_seed.sql depuis src/data/*.ts
// Usage : node --experimental-strip-types scripts/generate-seed.mjs
import { writeFileSync } from 'node:fs';
import { AUDIO_SEED } from '../src/data/audios.ts';
import { DOJO_SEED } from '../src/data/dojo.ts';

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const lines = [
  '-- Fichier généré par scripts/generate-seed.mjs. Ne pas modifier à la main.',
  '-- Contenu initial : 5 audios d’ancrage, diagnostic, scénarios du Dojo.',
  '',
  'insert into public.audio_exercises (title, description, audio_url, category, duration_seconds, is_active, position) values',
  AUDIO_SEED.map((a) => `  (${q(a.title)}, ${q(a.description)}, ${q(a.audio_url)}, 'centering', ${a.duration_seconds}, true, ${a.position})`).join(',\n') + ';',
  '',
];

// Le diagnostic n'est plus en base : il est défini dans src/data/diagnostic.ts.

lines.push(
  'insert into public.exercises (title, description, category, content, estimated_duration, difficulty_level, is_active) values',
  DOJO_SEED.map((e) => `  (${q(e.title)}, ${q(e.description)}, ${q(e.category)}, ${q(JSON.stringify(e.content))}::jsonb, ${e.estimated_duration}, ${q(e.difficulty_level)}, true)`).join(',\n') + ';',
  '',
);

writeFileSync(new URL('../supabase/migrations/20261111000002_seed.sql', import.meta.url), lines.join('\n'));
console.log('Seed écrit.');
