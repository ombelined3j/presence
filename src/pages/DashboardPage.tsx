import { useState } from 'react';
import { Link } from 'react-router-dom';
import DailySessionCard from '../components/DailySessionCard';
import FocusCard from '../components/FocusCard';
import ProgressTracker from '../components/ProgressTracker';
import SessionHistory from '../components/SessionHistory';
import SOSCard from '../components/SOSCard';
import { ProfileIcon } from '../components/Icons';
import { ErrorBox, Loader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { completedToday, fetchSessions, fetchTodayAudio } from '../services/sessions';
import type { SessionMode } from '../types';
import { formatLongDate, greeting } from '../utils/dates';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [mode, setMode] = useState<SessionMode>('centering');
  const { data, loading, error, reload } = useAsync(async () => {
    const [audio, sessions] = await Promise.all([fetchTodayAudio(), fetchSessions(user!.id)]);
    return { audio, sessions };
  }, [user?.id]);

  const name = profile?.first_name;
  const doneToday = data ? completedToday(data.sessions).some((s) => s.mode === 'centering' && s.source === 'daily') : false;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="surtitre">{greeting()}{name ? `, ${name}` : ''}</p>
          <p className="mt-1 text-mini text-encre/60">{formatLongDate()}</p>
        </div>
        <Link to="/app/profil" aria-label="Mon profil" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-encre lg:hidden">
          <ProfileIcon />
        </Link>
      </header>

      <div className="relative">
        <span className="pointer-events-none absolute -right-10 top-2 h-32 w-32 rounded-full bg-sable" aria-hidden />
        <h1 className="relative max-w-[16ch] text-titre">
          Une séance de <span className="text-vert">5 minutes</span>, rien que pour vous.
        </h1>
      </div>

      {loading ? (
        <Loader label="Préparation de votre séance…" />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <DailySessionCard mode={mode} onModeChange={setMode} audio={data?.audio ?? null} doneToday={doneToday} />
      )}
      {!loading && !error && !data?.audio && mode === 'centering' && (
        <ErrorBox message="Aucun audio de centrage n’est disponible pour le moment. La bibliothèque est peut-être vide." />
      )}

      <div className="grid grid-cols-2 gap-3">
        <FocusCard to="/app/seance/preparer" title="Préparer une situation" color="sable" />
        <SOSCard compact />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FocusCard to="/app/dojo" kicker="À la séance" title="Dojo" text="S’entraîner sur des mises en situation." color="lilas" />
        <FocusCard to="/app/focus" kicker="À la demande" title="Focus" text="Réécouter un centrage." color="surface" />
      </div>

      {data && (
        <>
          <ProgressTracker sessions={data.sessions} />
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-titre text-carte">Dernières séances</h2>
              <Link to="/app/profil" className="text-mini text-vert underline-offset-4 hover:underline">Tout voir</Link>
            </div>
            <SessionHistory sessions={data.sessions} limit={4} />
          </section>
        </>
      )}
    </div>
  );
}
