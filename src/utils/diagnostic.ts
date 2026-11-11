import { REFLEX_TYPES, type DiagnosticComputed, type DiagnosticQuestion, type ReflexScores, type ReflexType } from '../types';

export function emptyScores(): ReflexScores {
  return { avoidance: 0, accommodation: 0, defense: 0, control: 0, withdrawal: 0 };
}

// selected : question_id -> answer_id
export function computeDiagnostic(questions: DiagnosticQuestion[], selected: Record<string, string>): DiagnosticComputed {
  const scores = emptyScores();
  const answers: DiagnosticComputed['answers'] = [];
  // Ordre d'apparition des réponses, pour départager les égalités de façon stable :
  // à score égal, le réflexe choisi le plus tôt dans le questionnaire l'emporte.
  const firstSeen = new Map<ReflexType, number>();

  questions.forEach((q, index) => {
    const answer = q.answers.find((a) => a.id === selected[q.id]);
    if (!answer) return;
    scores[answer.reflex_type] += answer.score;
    answers.push({ question_id: q.id, answer_id: answer.id, reflex_type: answer.reflex_type });
    if (!firstSeen.has(answer.reflex_type)) firstSeen.set(answer.reflex_type, index);
  });

  const ranked = [...REFLEX_TYPES].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return (firstSeen.get(a) ?? 99) - (firstSeen.get(b) ?? 99);
  });

  const dominant = ranked[0];
  const secondary = scores[ranked[1]] > 0 ? ranked[1] : null;
  return { scores, dominant, secondary, answers };
}
