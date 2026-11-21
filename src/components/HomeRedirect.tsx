import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// La page d'accueil de l'app est la page Application du site vitrine (site/application/).
// Une personne connectée va directement à son espace.
export const SITE_APPLICATION_URL =
  (import.meta.env.DEV ? 'http://localhost:4173' : 'https://presence-authentique-site.vercel.app') + '/application/';

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  const versLeSite = !loading && !user;

  useEffect(() => {
    if (versLeSite) window.location.replace(SITE_APPLICATION_URL + window.location.search);
  }, [versLeSite]);

  if (!loading && user) return <Navigate to="/app" replace />;
  return null;
}
