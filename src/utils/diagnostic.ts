import { REFLEX_TYPES, type DiagnosticComputed, type DiagnosticQuestion, type ReflexScores } from '../types';

export function emptyScores(): ReflexScores {
  return { withdraw: 0, endure: 0, overadapt: 0, impose: 0, conform: 0 };
}

// Calcul (page Notion) : on additionne les deux réponses de chaque réflexe (score de −4 à +4).
// Le score le plus élevé donne le réflexe principal, le deuxième le réflexe secondaire.
// En cas d’égalité, les réflexes concernés partagent le même rang.
// selected : question_id -> answer_id
export function computeDiagnostic(questions: DiagnosticQuestion[], selected: Record<string, string>): DiagnosticComputed {
  const scores = emptyScores();
  const answers: DiagnosticComputed['answers'] = [];

  questions.forEach((q) => {
    const answer = q.answers.find((a) => a.id === selected[q.id]);
    if (!answer) return;
    scores[answer.reflex_type] += answer.score;
    answers.push({ question_id: q.id, answer_id: answer.id, reflex_type: answer.reflex_type, score: answer.score });
  });

  const distincts = [...new Set(REFLEX_TYPES.map((r) => scores[r]))].sort((a, b) => b - a);
  const principal = REFLEX_TYPES.filter((r) => scores[r] === distincts[0]);
  // Si plusieurs réflexes sont premiers ex æquo, ils sont tous principaux : pas de secondaire.
  const secondaires = principal.length === 1 && distincts.length > 1 ? REFLEX_TYPES.filter((r) => scores[r] === distincts[1]) : [];

  return {
    scores,
    principal,
    secondaires,
    dominant: principal[0],
    secondary: principal[1] ?? secondaires[0] ?? null,
    answers,
  };
}
