import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../integrations/supabase/client';
import BottomNavigation from './BottomNavigation';
import { Loader } from './ui';

export function ConfigBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="bg-sable px-4 py-2 text-center text-mini text-encre">
      Supabase n’est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Le diagnostic fonctionne, la connexion et les données non.
    </div>
  );
}

// Pages publiques : colonne centrée.
export function PublicLayout() {
  return (
    <div className="min-h-dvh">
      <ConfigBanner />
      <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

// Pages protégées : redirection vers la connexion si nécessaire, navigation fixe.
export function ProtectedLayout({ bare = false }: { bare?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  if (bare) {
    return (
      <div className="min-h-dvh">
        <ConfigBanner />
        <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-dvh lg:pl-60">
      <ConfigBanner />
      <main className="mx-auto w-full max-w-2xl px-4 pb-32 pt-6 sm:px-6 lg:pb-12 lg:pt-10">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}

// Pages réservées aux visiteurs non connectés (connexion, inscription).
export function GuestOnly({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}
