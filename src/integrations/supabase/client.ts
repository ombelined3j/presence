import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Seule la clé publique (anon / publishable) est utilisée côté navigateur.
// La clé service_role ne doit jamais apparaître dans le frontend.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient = createClient(
  url || 'http://localhost:54321',
  anonKey || 'public-anon-key-missing',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
