import type { DiagnosticQuestion, ReflexType } from '../types';

// Source unique du contenu du diagnostic.
// - Sert de seed pour la base (scripts/generate-seed.mjs).
// - Sert de secours si Supabase n'est pas configuré ou ne renvoie rien.

interface SeedQuestion {
  question: string;
  answers: { label: string; reflex: ReflexType }[];
}

export const DIAGNOSTIC_SEED: SeedQuestion[] = [
  {
    question: 'Une conversation délicate se profile : un désaccord, une demande à faire. Le plus souvent, vous…',
    answers: [
      { label: 'La repoussez, en espérant qu’elle ne soit bientôt plus nécessaire.', reflex: 'avoidance' },
      { label: 'Pensez surtout à ce que l’autre attend, pour ne pas le contrarier.', reflex: 'accommodation' },
      { label: 'Préparez vos arguments pour ne pas vous laisser faire.', reflex: 'defense' },
      { label: 'Planifiez précisément le déroulé, pour que rien ne vous échappe.', reflex: 'control' },
      { label: 'Sentez déjà une boule au ventre et redoutez de rester sans voix.', reflex: 'withdrawal' },
    ],
  },
  {
    question: 'On vous adresse une critique que vous trouvez injuste. Votre premier réflexe :',
    answers: [
      { label: 'Me justifier tout de suite, point par point.', reflex: 'defense' },
      { label: 'M’excuser, même si je ne suis pas d’accord.', reflex: 'accommodation' },
      { label: 'Changer de sujet ou minimiser pour passer à autre chose.', reflex: 'avoidance' },
      { label: 'Recadrer la discussion pour reprendre la main.', reflex: 'control' },
      { label: 'Me taire et me fermer, quitte à y repenser pendant des heures.', reflex: 'withdrawal' },
    ],
  },
  {
    question: 'Au milieu d’un échange qui se tend, ce qui vous arrive le plus souvent :',
    answers: [
      { label: 'Je perds mes mots, j’ai la tête vide.', reflex: 'withdrawal' },
      { label: 'Le ton monte, je réponds du tac au tac.', reflex: 'defense' },
      { label: 'Je coupe la parole pour orienter la conversation.', reflex: 'control' },
      { label: 'Je cède pour que la tension retombe.', reflex: 'accommodation' },
      { label: 'Je trouve une raison d’écourter la conversation.', reflex: 'avoidance' },
    ],
  },
  {
    question: 'Après une conversation difficile, vous vous dites souvent :',
    answers: [
      { label: '« J’aurais dû dire ce dont j’avais vraiment besoin. »', reflex: 'accommodation' },
      { label: '« J’ai réagi trop vite, trop fort. »', reflex: 'defense' },
      { label: '« Je n’ai presque rien dit de ce que je pensais. »', reflex: 'withdrawal' },
      { label: '« Je n’ai pas vraiment écouté ce que l’autre voulait dire. »', reflex: 'control' },
      { label: '« Finalement, on n’a pas parlé du vrai sujet. »', reflex: 'avoidance' },
    ],
  },
  {
    question: 'Dans une conversation importante, ce qui vous rassure le plus :',
    answers: [
      { label: 'Savoir exactement où l’on va, et comment.', reflex: 'control' },
      { label: 'Sentir que l’autre est satisfait.', reflex: 'accommodation' },
      { label: 'Que cela ne dure pas trop longtemps.', reflex: 'avoidance' },
      { label: 'Avoir de bons arguments en réserve.', reflex: 'defense' },
      { label: 'Pouvoir prendre du recul et y revenir plus tard.', reflex: 'withdrawal' },
    ],
  },
];

// Version "prête à l'emploi" avec des identifiants locaux, utilisée en secours.
export const LOCAL_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = DIAGNOSTIC_SEED.map((q, qi) => ({
  id: `local-q${qi + 1}`,
  question: q.question,
  position: qi + 1,
  answers: q.answers.map((a, ai) => ({
    id: `local-q${qi + 1}-a${ai + 1}`,
    question_id: `local-q${qi + 1}`,
    answer_label: a.label,
    reflex_type: a.reflex,
    score: 1,
  })),
}));
