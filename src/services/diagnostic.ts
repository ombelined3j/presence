import { supabase } from '../integrations/supabase/client';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnostic';
import type { DiagnosticComputed, DiagnosticQuestion, DiagnosticResultRow } from '../types';

// Le questionnaire est défini dans le code (src/data/diagnostic.ts).
export async function fetchDiagnosticQuestions(): Promise<DiagnosticQuestion[]> {
  return DIAGNOSTIC_QUESTIONS;
}

export async function saveDiagnosticResult(userId: string, result: DiagnosticComputed): Promise<DiagnosticResultRow> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert({
      user_id: userId,
      result_data: { scores: result.scores, principal: result.principal, secondaires: result.secondaires, answers: result.answers },
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

export type EnvoiResultat = 'envoye' | 'echec';

// Envoie le résultat par e-mail et inscrit l’adresse à la newsletter (fonction Supabase « diagnostic-email »).
export async function envoyerResultatParEmail(email: string, result: DiagnosticComputed): Promise<EnvoiResultat> {
  try {
    const { error } = await supabase.functions.invoke('diagnostic-email', {
      body: { email, principal: result.principal, secondaires: result.secondaires, scores: result.scores },
    });
    return error ? 'echec' : 'envoye';
  } catch {
    return 'echec';
  }
}
