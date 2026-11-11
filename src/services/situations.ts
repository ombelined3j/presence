import { supabase } from '../integrations/supabase/client';
import type { DifficultSituation, SituationContext } from '../types';

export async function saveSituation(params: {
  userId: string;
  description: string;
  personInvolved?: string | null;
  mainConcern?: string | null;
  emotionalState?: string | null;
  context: SituationContext;
  preparationData: Record<string, unknown>;
}): Promise<DifficultSituation> {
  const { data, error } = await supabase
    .from('difficult_situations')
    .insert({
      user_id: params.userId,
      description: params.description,
      person_involved: params.personInvolved || null,
      main_concern: params.mainConcern || null,
      emotional_state: params.emotionalState || null,
      context: params.context,
      preparation_data: params.preparationData,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DifficultSituation;
}

export async function fetchSituations(userId: string, limit = 20): Promise<DifficultSituation[]> {
  const { data, error } = await supabase
    .from('difficult_situations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DifficultSituation[];
}
