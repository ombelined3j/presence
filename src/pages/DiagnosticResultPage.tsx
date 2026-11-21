import { Link, Navigate, useLocation } from 'react-router-dom';
import DiagnosticResult from '../components/DiagnosticResult';
import { ArrowUpRight } from '../components/Icons';
import { Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import type { EnvoiResultat } from '../services/diagnostic';
import type { DiagnosticComputed } from '../types';
import { readPendingDiagnostic } from '../utils/pendingDiagnostic';

export default function DiagnosticResultPage() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { result?: DiagnosticComputed; email?: string; envoi?: EnvoiResultat } | null;
  const result = state?.result ?? readPendingDiagnostic();
  // Un ancien résultat (format précédent) ne peut pas s’afficher : on refait le diagnostic.
  if (!result || !Array.isArray(result.principal)) return <Navigate to="/diagnostic" replace />;

  return (
    <div className="flex flex-col gap-8">
      <Link to="/"><Wordmark /></Link>
      <header>
        <p className="surtitre">Votre résultat</p>
        <h1 className="mt-2 text-titre">
          Voici vos <span className="text-vert">réflexes</span> du moment.
        </h1>
        <p className="mt-3 text-corps text-encre/75">Un point de départ, pas une étiquette. Vos réflexes évoluent avec la pratique.</p>
        {state?.email && state.envoi === 'envoye' && (
          <p className="mt-4 rounded-carte bg-surface p-4 text-mini text-encre/80">
            Votre résultat vient de vous être envoyé à <span className="text-vert">{state.email}</span>.
          </p>
        )}
        {state?.email && state.envoi === 'echec' && (
          <p className="mt-4 rounded-carte bg-surface p-4 text-mini text-encre/80">
            L’e-mail n’a pas pu être envoyé pour le moment. Votre résultat reste affiché ici.
          </p>
        )}
      </header>

      <DiagnosticResult principal={result.principal} secondaires={result.secondaires} />

      {user ? (
        <div className="flex flex-col gap-3">
          <p className="text-mini text-vert">Résultat enregistré dans votre profil.</p>
          <Link to="/app" className="btn-vert">Aller à mon tableau de bord <ArrowUpRight /></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Link to="/inscription" className="btn-vert">Créer mon compte pour continuer <ArrowUpRight /></Link>
          <p className="text-center text-mini text-encre/60">
            Votre résultat est conservé sur cet appareil et sera associé à votre compte.
          </p>
          <Link to="/connexion" className="text-center text-mini text-vert underline underline-offset-4">J’ai déjà un compte</Link>
        </div>
      )}
    </div>
  );
}
