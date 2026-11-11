import { isSupabaseConfigured, supabase } from '../integrations/supabase/client';
import { LOCAL_DIAGNOSTIC_QUESTIONS } from '../data/diagnostic';
import type { DiagnosticComputed, DiagnosticQuestion, DiagnosticResultRow } from '../types';

export async function fetchDiagnosticQuestions(): Promise<DiagnosticQuestion[]> {
  if (!isSupabaseConfigured) return LOCAL_DIAGNOSTIC_QUESTIONS;
  const { data, error } = await supabase
    .from('diagnostic_questions')
    .select('id, question, position, answers:diagnostic_answers(id, question_id, answer_label, reflex_type, score)')
    .eq('is_active', true)
    .order('position');
  if (error) throw error;
  const questions = (data ?? []) as DiagnosticQuestion[];
  // Base vide (seed non appliqué) : on garde un diagnostic utilisable.
  if (questions.length === 0) return LOCAL_DIAGNOSTIC_QUESTIONS;
  return questions;
}

export async function saveDiagnosticResult(userId: string, result: DiagnosticComputed): Promise<DiagnosticResultRow> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert({
      user_id: userId,
      result_data: { scores: result.scores, answers: result.answers },
      dominant_reflex: result.dominant,
      secondary_reflex: result.secondary,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DiagnosticResultRow;
}

export async function fetchDiagnosticHistory(userId: string): Promise<DiagnosticResultRow[]> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as DiagnosticResultRow[];
}
