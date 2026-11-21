import type { DiagnosticQuestion, ReflexType } from '../types';

// Questionnaire initial, repris mot pour mot de la page Notion « Contenu de l’app ».
// Pour chaque affirmation, la personne se place sur une échelle de 5 positions.
// Chaque réflexe est évalué par 2 affirmations : son score va de −4 à +4.

export const ECHELLE: { label: string; score: number }[] = [
  { label: 'Pas du tout d’accord', score: -2 },
  { label: 'Plutôt pas d’accord', score: -1 },
  { label: 'Pas d’avis', score: 0 },
  { label: 'Plutôt d’accord', score: 1 },
  { label: 'Totalement d’accord', score: 2 },
];

export const AFFIRMATIONS: { texte: string; reflex: ReflexType }[] = [
  { texte: 'Quand une conversation me met mal à l’aise, je trouve une raison de partir ou de raccrocher.', reflex: 'withdraw' },
  { texte: 'Quand j’ai peur que dire non déçoive quelqu’un, je lui dis oui sans me demander si ça me convient.', reflex: 'overadapt' },
  { texte: 'Quand un échange se tend, je cherche la règle à suivre, ou ce qu’on est censé faire dans cette situation.', reflex: 'conform' },
  { texte: 'Quand une remarque me dérange, je garde pour moi ce que j’aimerais dire et j’attends que ça passe.', reflex: 'endure' },
  { texte: 'Quand quelqu’un remet ma décision en question, je lui coupe la parole pour faire passer mon point de vue.', reflex: 'impose' },
  { texte: 'Quand un sujet me met mal à l’aise, je dévie la conversation vers un autre sujet.', reflex: 'withdraw' },
  { texte: 'Quand l’autre n’est pas d’accord avec moi, j’insiste pour qu’il finisse par céder.', reflex: 'impose' },
  { texte: 'Quand j’ai peur de mal répondre, je cherche les mots parfaits.', reflex: 'conform' },
  { texte: 'Quand le groupe s’apprête à prendre une décision qui ne me convient pas, je garde mon désaccord pour moi.', reflex: 'endure' },
  { texte: 'Quand l’autre est contrarié, je vais dans son sens pour calmer la situation, même si ça ne m’arrange pas.', reflex: 'overadapt' },
];

// Le questionnaire vit dans le code (une seule source) : chaque affirmation devient une
// question dont les 5 réponses portent le même réflexe et un score de −2 à +2.
export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = AFFIRMATIONS.map((a, qi) => ({
  id: `q${qi + 1}`,
  question: a.texte,
  position: qi + 1,
  answers: ECHELLE.map((e, ai) => ({
    id: `q${qi + 1}-a${ai + 1}`,
    question_id: `q${qi + 1}`,
    answer_label: e.label,
    reflex_type: a.reflex,
    score: e.score,
  })),
}));
