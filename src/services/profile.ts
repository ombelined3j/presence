import { supabase } from '../integrations/supabase/client';
import type { Profile } from '../types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function updateProfile(userId: string, patch: Partial<Pick<Profile, 'first_name' | 'reminder_time' | 'timezone'>>): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', userId).select().single();
  if (error) throw error;
  return data as Profile;
}

export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle();
  if (error) return false;
  return Boolean(data);
}

// Export de toutes les données de l'utilisateur (droit d'accès / portabilité).
export async function exportMyData(userId: string): Promise<Record<string, unknown>> {
  const tables = ['profiles', 'diagnostic_results', 'daily_sessions', 'difficult_situations', 'exercise_completions'] as const;
  const out: Record<string, unknown> = { exported_at: new Date().toISOString() };
  for (const t of tables) {
    const column = t === 'profiles' ? 'id' : 'user_id';
    const { data, error } = await supabase.from(t).select('*').eq(column, userId);
    if (error) throw error;
    out[t] = data;
  }
  return out;
}

export async function deleteMyAccount(): Promise<void> {
  const { error } = await supabase.rpc('delete_my_account');
  if (error) throw error;
}
