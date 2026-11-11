// Génère supabase/migrations/20261111000002_seed.sql depuis src/data/*.ts
// Usage : node --experimental-strip-types scripts/generate-seed.mjs
import { writeFileSync } from 'node:fs';
import { AUDIO_SEED } from '../src/data/audios.ts';
import { DIAGNOSTIC_SEED } from '../src/data/diagnostic.ts';
import { DOJO_SEED } from '../src/data/dojo.ts';

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const lines = [
  '-- Fichier généré par scripts/generate-seed.mjs. Ne pas modifier à la main.',
  '-- Contenu initial : 5 audios de centrage, diagnostic, scénarios du Dojo.',
  '',
  'insert into public.audio_exercises (title, description, audio_url, category, duration_seconds, is_active, position) values',
  AUDIO_SEED.map((a) => `  (${q(a.title)}, ${q(a.description)}, ${q(a.audio_url)}, 'centering', ${a.duration_seconds}, true, ${a.position})`).join(',\n') + ';',
  '',
];

DIAGNOSTIC_SEED.forEach((question, i) => {
  lines.push(
    'with q as (',
    `  insert into public.diagnostic_questions (question, position, is_active) values (${q(question.question)}, ${i + 1}, true) returning id`,
    ')',
    'insert into public.diagnostic_answers (question_id, answer_label, reflex_type, score)',
    'select q.id, v.label, v.reflex, 1 from q, (values',
    question.answers.map((a) => `  (${q(a.label)}, ${q(a.reflex)})`).join(',\n'),
    ') as v(label, reflex);',
    '',
  );
});

lines.push(
  'insert into public.exercises (title, description, category, content, estimated_duration, difficulty_level, is_active) values',
  DOJO_SEED.map((e) => `  (${q(e.title)}, ${q(e.description)}, ${q(e.category)}, ${q(JSON.stringify(e.content))}::jsonb, ${e.estimated_duration}, ${q(e.difficulty_level)}, true)`).join(',\n') + ';',
  '',
);

writeFileSync(new URL('../supabase/migrations/20261111000002_seed.sql', import.meta.url), lines.join('\n'));
console.log('Seed écrit.');
