import { supabase } from '../integrations/supabase/client';
import { dayIndex, localDateISO } from '../utils/dates';
import type { AudioExercise, DailySession, SessionMode, SessionSource } from '../types';

export async function fetchActiveAudios(category = 'centering'): Promise<AudioExercise[]> {
  const { data, error } = await supabase
    .from('audio_exercises')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('position');
  if (error) throw error;
  return (data ?? []) as AudioExercise[];
}

// Choix de l'audio du jour :
// 1. une programmation explicite pour la date (table audio_schedule), si elle existe et que l'audio est actif ;
// 2. sinon une rotation stable sur les audios actifs, triés par position.
export async function fetchTodayAudio(date = localDateISO()): Promise<AudioExercise | null> {
  const audios = await fetchActiveAudios();
  if (audios.length === 0) return null;

  const { data: scheduled, error } = await supabase
    .from('audio_schedule')
    .select('exercise_id')
    .eq('scheduled_date', date)
    .maybeSingle();
  if (error) throw error;
  if (scheduled) {
    const match = audios.find((a) => a.id === scheduled.exercise_id);
    if (match) return match;
  }
  return audios[dayIndex(date) % audios.length];
}

export async function startSession(params: {
  userId: string;
  mode: SessionMode;
  exerciseId?: string | null;
  source?: SessionSource;
}): Promise<DailySession> {
  const { data, error } = await supabase
    .from('daily_sessions')
    .insert({
      user_id: params.userId,
      exercise_id: params.exerciseId ?? null,
      session_date: localDateISO(),
      mode: params.mode,
      source: params.source ?? 'daily',
      status: 'started',
      duration_seconds: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DailySession;
}

// Reprise : une séance interrompue aujourd'hui sur le même audio peut être reprise.
export async function findResumableSession(userId: string, exerciseId: string, source: SessionSource): Promise<DailySession | null> {
  const { data, error } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .eq('session_date', localDateISO())
    .eq('source', source)
    .in('status', ['started', 'interrupted'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as DailySession | null;
}

export async function updateSessionStatus(id: string, status: 'started' | 'interrupted' | 'completed', durationSeconds: number): Promise<DailySession> {
  const { data, error } = await supabase
    .from('daily_sessions')
    .update({ status, duration_seconds: Math.floor(durationSeconds) })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as DailySession;
}

export async function fetchSessions(userId: string, limit = 60): Promise<DailySession[]> {
  const { data, error } = await supabase
    .from('daily_sessions')
    .select('*, audio_exercises(title)')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DailySession[];
}

export function completedToday(sessions: DailySession[]): DailySession[] {
  const today = localDateISO();
  return sessions.filter((s) => s.session_date === today && s.status === 'completed');
}
