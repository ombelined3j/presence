import { describe, expect, it } from 'vitest';
import { LOCAL_DIAGNOSTIC_QUESTIONS } from '../../data/diagnostic';
import { REFLEX_TYPES } from '../../types';
import { computeDiagnostic } from '../diagnostic';
import { dayIndex, localDateISO } from '../dates';

const pick = (reflexes: string[]) =>
  Object.fromEntries(
    LOCAL_DIAGNOSTIC_QUESTIONS.map((q, i) => [q.id, q.answers.find((a) => a.reflex_type === reflexes[i])!.id]),
  );

describe('computeDiagnostic', () => {
  it('chaque question propose les cinq réflexes', () => {
    for (const q of LOCAL_DIAGNOSTIC_QUESTIONS) {
      expect(new Set(q.answers.map((a) => a.reflex_type))).toEqual(new Set(REFLEX_TYPES));
    }
  });

  it('identifie le réflexe dominant et secondaire', () => {
    const r = computeDiagnostic(LOCAL_DIAGNOSTIC_QUESTIONS, pick(['defense', 'defense', 'defense', 'withdrawal', 'withdrawal']));
    expect(r.dominant).toBe('defense');
    expect(r.secondary).toBe('withdrawal');
    expect(r.scores.defense).toBe(3);
    expect(r.answers).toHaveLength(5);
  });

  it('départage une égalité par l’ordre d’apparition', () => {
    const r = computeDiagnostic(LOCAL_DIAGNOSTIC_QUESTIONS, pick(['control', 'avoidance', 'avoidance', 'control', 'withdrawal']));
    expect(r.dominant).toBe('control');
    expect(r.secondary).toBe('avoidance');
  });

  it('pas de secondaire si un seul réflexe est choisi', () => {
    const r = computeDiagnostic(LOCAL_DIAGNOSTIC_QUESTIONS, pick(['avoidance', 'avoidance', 'avoidance', 'avoidance', 'avoidance']));
    expect(r.secondary).toBeNull();
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
