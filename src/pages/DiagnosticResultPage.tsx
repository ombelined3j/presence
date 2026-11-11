import { Link, Navigate, useLocation } from 'react-router-dom';
import DiagnosticResult from '../components/DiagnosticResult';
import { ArrowUpRight } from '../components/Icons';
import { Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { REFLEX_PROFILES } from '../data/reflexes';
import { AUDIO_SEED } from '../data/audios';
import type { DiagnosticComputed } from '../types';
import { readPendingDiagnostic } from '../utils/pendingDiagnostic';

export default function DiagnosticResultPage() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { result?: DiagnosticComputed; saved?: boolean } | null;
  const result = state?.result ?? readPendingDiagnostic();
  if (!result) return <Navigate to="/diagnostic" replace />;

  const profile = REFLEX_PROFILES[result.dominant];
  const audio = AUDIO_SEED.find((a) => a.key === profile.firstExercise.audioKey);

  return (
    <div className="flex flex-col gap-8">
      <Link to="/"><Wordmark /></Link>
      <header>
        <p className="surtitre">Votre résultat</p>
        <h1 className="mt-2 text-titre">
          Voici vos <span className="text-vert">réflexes</span> du moment.
        </h1>
        <p className="mt-3 text-corps text-encre/75">Un point de départ, pas une étiquette. Vos réflexes évoluent avec la pratique.</p>
      </header>

      <DiagnosticResult dominant={result.dominant} secondary={result.secondary} scores={result.scores} />

      <section className="rounded-carte bg-lilas p-6">
        <p className="text-mini text-encre/70">Votre premier exercice</p>
        <h2 className="mt-1 font-titre text-carte">{profile.firstExercise.title}</h2>
        <p className="mt-2 text-corps">{profile.firstExercise.text}</p>
        {audio && (
          <p className="mt-3 text-mini text-encre/75">
            Et pour votre première séance d’ancrage : « {audio.title} ».
          </p>
        )}
      </section>

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
