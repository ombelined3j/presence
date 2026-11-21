import { describe, expect, it } from 'vitest';
import { DIAGNOSTIC_QUESTIONS } from '../../data/diagnostic';
import { REFLEX_TYPES } from '../../types';
import { computeDiagnostic } from '../diagnostic';
import { dayIndex, localDateISO } from '../dates';

// Réponses par score (−2 à +2), dans l’ordre des 10 affirmations.
const repondre = (scores: number[]) =>
  Object.fromEntries(DIAGNOSTIC_QUESTIONS.map((q, i) => [q.id, q.answers.find((a) => a.score === scores[i])!.id]));

describe('computeDiagnostic', () => {
  it('chaque réflexe est évalué par 2 affirmations, avec une échelle de −2 à +2', () => {
    expect(DIAGNOSTIC_QUESTIONS).toHaveLength(10);
    for (const r of REFLEX_TYPES) {
      expect(DIAGNOSTIC_QUESTIONS.filter((q) => q.answers[0].reflex_type === r)).toHaveLength(2);
    }
    for (const q of DIAGNOSTIC_QUESTIONS) expect(q.answers.map((a) => a.score)).toEqual([-2, -1, 0, 1, 2]);
  });

  it('reproduit l’exemple de la page Notion', () => {
    const r = computeDiagnostic(DIAGNOSTIC_QUESTIONS, repondre([1, -1, -2, 2, 1, 1, -1, 1, -1, 2]));
    expect(r.scores).toEqual({ withdraw: 2, endure: 1, overadapt: 1, impose: 0, conform: -1 });
    expect(r.principal).toEqual(['withdraw']);
    expect(r.secondaires).toEqual(['endure', 'overadapt']);
  });

  it('plusieurs réflexes premiers ex æquo sont tous principaux, sans secondaire', () => {
    const r = computeDiagnostic(DIAGNOSTIC_QUESTIONS, repondre([2, 0, 0, 2, 0, 2, 0, 0, 2, 0]));
    expect(r.principal).toEqual(['withdraw', 'endure']);
    expect(r.secondaires).toEqual([]);
  });

  it('des réponses toutes identiques placent les 5 réflexes au même rang', () => {
    const r = computeDiagnostic(DIAGNOSTIC_QUESTIONS, repondre(Array(10).fill(0)));
    expect(r.principal).toEqual(REFLEX_TYPES);
    expect(r.secondaires).toEqual([]);
  });
});

describe('dates', () => {
  it('dayIndex avance de 1 par jour, pour la rotation des audios', () => {
    expect(dayIndex('2026-11-12') - dayIndex('2026-11-11')).toBe(1);
    expect(dayIndex('2027-01-01') - dayIndex('2026-12-31')).toBe(1);
  });
  it('localDateISO utilise la date locale', () => {
    expect(localDateISO(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});
