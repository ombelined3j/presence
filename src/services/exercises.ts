import { supabase } from '../integrations/supabase/client';
import type { Exercise, ExerciseCompletion } from '../types';

export async function fetchExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true)
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as Exercise[];
}

export async function fetchExercise(id: string): Promise<Exercise | null> {
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Exercise | null;
}

export async function saveCompletion(userId: string, exerciseId: string, resultData: Record<string, unknown>): Promise<void> {
  const { error } = await supabase
    .from('exercise_completions')
    .insert({ user_id: userId, exercise_id: exerciseId, result_data: resultData });
  if (error) throw error;
}

export async function fetchCompletions(userId: string, limit = 50): Promise<ExerciseCompletion[]> {
  const { data, error } = await supabase
    .from('exercise_completions')
    .select('*, exercises(title, category)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ExerciseCompletion[];
}
