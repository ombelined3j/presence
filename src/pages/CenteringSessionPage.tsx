import { Link, useParams } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import { ArrowUpRight, CheckIcon } from '../components/Icons';
import { EmptyState, ErrorBox, Loader, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { useListeningSession } from '../hooks/useListeningSession';
import { fetchActiveAudios, fetchTodayAudio } from '../services/sessions';
import type { SessionSource } from '../types';
import { formatClock } from '../utils/dates';

// Séance quotidienne, mode Ancrage (source "daily"),
// ou réécoute libre d'un audio depuis Focus (source "focus", /app/focus/audio/:id).
export default function CenteringSessionPage({ source = 'daily' }: { source?: SessionSource }) {
  const { user } = useAuth();
  const { id } = useParams();
  const { data: audio, loading, error, reload } = useAsync(async () => {
    if (source === 'focus' && id) {
      const all = await fetchActiveAudios();
      return all.find((a) => a.id === id) ?? null;
    }
    return fetchTodayAudio();
  }, [source, id]);

  const s = useListeningSession(user?.id, audio ?? null, source);
  const back = source === 'focus' ? '/app/focus' : '/app';

  if (loading) return <Loader label="Préparation de votre séance…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!audio) {
    return (
      <>
        <PageHeader kicker="Séance du jour" title="Aucun audio disponible" back={back} />
        <EmptyState title="La bibliothèque est vide">Aucun audio d’ancrage actif n’a été trouvé.</EmptyState>
      </>
    );
  }

  if (s.phase === 'completed') {
    return (
      <div className="flex flex-col gap-6 pt-4">
        <div className="relative overflow-hidden rounded-carte bg-vert p-7 text-white">
          <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-lilas" aria-hidden />
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-vert"><CheckIcon /></span>
          <h1 className="relative mt-4 font-titre text-titre">Séance terminée.</h1>
          <p className="relative mt-3 text-corps text-white/85">
            Vous avez pris {formatClock(s.listened)} pour vous. Gardez cette sensation avec vous dans les conversations d’aujourd’hui.
          </p>
        </div>
        <p className="text-corps text-encre/75">Une conversation vous attend aujourd’hui ? Vous pouvez la préparer maintenant.</p>
        <Link to="/app/seance/preparer" className="btn-ligne">Préparer une situation <ArrowUpRight /></Link>
        <Link to={back} className="btn-vert">{source === 'focus' ? 'Retour à Focus' : 'Retour à l’accueil'}</Link>
      </div>
    );
  }

  if (s.phase === 'stopped') {
    return (
      <div className="flex flex-col gap-6 pt-4">
        <PageHeader kicker="Séance du jour" title="Pause enregistrée." highlight="Ce n’est pas grave.">
          Vous avez écouté {formatClock(s.listened)}. Vous pourrez reprendre là où vous en étiez aujourd’hui, ou revenir demain.
        </PageHeader>
        <button onClick={s.resume} className="btn-ligne">Reprendre maintenant</button>
        <Link to={back} className="btn-vert">Retour</Link>
      </div>
    );
  }

  const remainingToUnlock = Math.max(0, s.required - s.listened);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader kicker={source === 'focus' ? 'Focus · ancrage' : 'Séance du jour · ancrage'} title="Prenez un moment" highlight="pour vous." back={back}>
        Installez-vous confortablement, dans un endroit calme si possible. Le casque ou les écouteurs aident.
      </PageHeader>

      {s.phase === 'loading' ? (
        <Loader />
      ) : (
        <AudioPlayer
          key={audio.id}
          src={audio.audio_url}
          title={audio.title}
          description={audio.description}
          expectedSeconds={audio.duration_seconds}
          initialPosition={s.resumeFrom}
          initialListened={s.resumeFrom}
          onPlay={s.onPlay}
          onPause={s.onPause}
          onListenedChange={s.onProgress}
        />
      )}
      {s.resumeFrom > 0 && s.phase === 'ready' && (
        <p className="text-mini text-encre/65">Reprise de votre écoute à {formatClock(s.resumeFrom)}.</p>
      )}
      {s.error && <ErrorBox message={s.error} />}

      <div className="flex flex-col gap-3">
        <button className="btn-vert" disabled={!s.canComplete || s.busy} onClick={s.complete}>
          {s.busy ? 'Enregistrement…' : 'Terminer ma séance'}
        </button>
        {!s.canComplete && (
          <p className="text-center text-mini text-encre/55">
            Disponible après l’écoute ({formatClock(remainingToUnlock)} restantes).
          </p>
        )}
        <button className="text-center text-mini text-encre/60 underline underline-offset-4" onClick={s.stop} disabled={s.busy}>
          Arrêter pour l’instant
        </button>
      </div>
    </div>
  );
}
