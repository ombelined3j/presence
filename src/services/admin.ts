import { supabase } from '../integrations/supabase/client';
import type { AudioExercise, AudioScheduleRow } from '../types';

// Toutes ces écritures sont refusées par les politiques RLS si l'utilisateur n'est pas dans public.admins.

export async function adminFetchAudios(): Promise<AudioExercise[]> {
  const { data, error } = await supabase.from('audio_exercises').select('*').order('position');
  if (error) throw error;
  return (data ?? []) as AudioExercise[];
}

export async function adminSaveAudio(audio: Partial<AudioExercise> & { id?: string }): Promise<void> {
  const { id, created_at: _created, ...fields } = audio;
  void _created;
  const query = id
    ? supabase.from('audio_exercises').update(fields).eq('id', id)
    : supabase.from('audio_exercises').insert(fields);
  const { error } = await query;
  if (error) throw error;
}

export async function adminFetchSchedule(fromDate: string): Promise<AudioScheduleRow[]> {
  const { data, error } = await supabase
    .from('audio_schedule')
    .select('*')
    .gte('scheduled_date', fromDate)
    .order('scheduled_date');
  if (error) throw error;
  return (data ?? []) as AudioScheduleRow[];
}

export async function adminSetSchedule(date: string, exerciseId: string): Promise<void> {
  const { error } = await supabase
    .from('audio_schedule')
    .upsert({ scheduled_date: date, exercise_id: exerciseId }, { onConflict: 'scheduled_date' });
  if (error) throw error;
}

export async function adminDeleteSchedule(id: string): Promise<void> {
  const { error } = await supabase.from('audio_schedule').delete().eq('id', id);
  if (error) throw error;
}
