import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../integrations/supabase/client';
import { fetchProfile, isCurrentUserAdmin } from '../services/profile';
import { saveDiagnosticResult } from '../services/diagnostic';
import { clearPendingDiagnostic, readPendingDiagnostic } from '../utils/pendingDiagnostic';
import { userTimezone } from '../utils/dates';
import type { Profile } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: (p: Profile) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const syncing = useRef(false);

  const loadUserData = useCallback(async (user: User | null) => {
    if (!user) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    // Associe au compte le résultat du diagnostic fait avant l'inscription.
    const pending = readPendingDiagnostic();
    if (pending && !syncing.current) {
      syncing.current = true;
      try {
        await saveDiagnosticResult(user.id, pending);
        clearPendingDiagnostic();
      } catch {
        // On garde le résultat en local, il sera réessayé à la prochaine connexion.
      } finally {
        syncing.current = false;
      }
    }
    try {
      const [p, admin] = await Promise.all([fetchProfile(user.id), isCurrentUserAdmin(user.id)]);
      setProfile(p);
      setIsAdmin(admin);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadUserData(data.session?.user ?? null);
      if (active) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // Différé : ne pas appeler Supabase de façon synchrone dans ce callback.
        setTimeout(() => void loadUserData(newSession?.user ?? null), 0);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadUserData]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isAdmin,
      loading,
      setProfile,
      refreshProfile: async () => {
        if (session?.user) await loadUserData(session.user);
      },
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await loadUserData(data.user);
      },
      signUp: async (email, password, firstName) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName?.trim() || null, timezone: userTimezone() },
            emailRedirectTo: `${window.location.origin}/bienvenue`,
          },
        });
        if (error) throw error;
        // Supabase renvoie un utilisateur sans identités quand l'email est déjà utilisé.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error('User already registered');
        }
        if (data.session) {
          await loadUserData(data.user);
          return { needsConfirmation: false };
        }
        return { needsConfirmation: true };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setIsAdmin(false);
      },
    }),
    [session, profile, isAdmin, loading, loadUserData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
