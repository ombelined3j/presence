import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// En production, l'adresse « / » de l'app affiche la page Application du site vitrine
// (réécriture dans vercel.json). Quand l'app elle-même arrive sur « / » (lien interne),
// on recharge la page pour l'afficher. En local, on ouvre le site sur le port 4173.
// Une personne connectée va directement à son espace.
export const SITE_APPLICATION_URL = import.meta.env.DEV ? 'http://localhost:4173/application/' : '/';

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  const versLeSite = !loading && !user;

  useEffect(() => {
    if (versLeSite) window.location.replace(SITE_APPLICATION_URL + window.location.search);
  }, [versLeSite]);

  if (!loading && user) return <Navigate to="/app" replace />;
  return null;
}
