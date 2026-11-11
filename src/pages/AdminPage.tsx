import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ErrorBox, Loader, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { adminDeleteSchedule, adminFetchAudios, adminFetchSchedule, adminSaveAudio, adminSetSchedule } from '../services/admin';
import { toMessage } from '../services/errors';
import type { AudioExercise } from '../types';
import { formatShortDate, localDateISO } from '../utils/dates';

// Bibliothèque administrable : audios (titre, description, URL, durée, ordre, actif)
// et programmation par date. Les droits sont vérifiés par les politiques RLS.
export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const today = localDateISO();
  const { data, loading, error, reload } = useAsync(async () => {
    const [audios, schedule] = await Promise.all([adminFetchAudios(), adminFetchSchedule(today)]);
    return { audios, schedule };
  }, []);
  const [msg, setMsg] = useState<string | null>(null);
  const [schedDate, setSchedDate] = useState(today);
  const [schedAudio, setSchedAudio] = useState('');

  if (authLoading) return <Loader />;
  if (!isAdmin) return <Navigate to="/app" replace />;

  const run = async (fn: () => Promise<void>, ok: string) => {
    setMsg(null);
    try {
      await fn();
      setMsg(ok);
      await reload();
    } catch (e) {
      setMsg(toMessage(e));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader kicker="Administration" title="Bibliothèque" highlight="audio." back="/app/profil">
        Sans programmation pour un jour donné, l’application propose les audios actifs en rotation, dans l’ordre des positions.
      </PageHeader>
      {msg && <p className="rounded-2xl bg-surface px-4 py-3 text-mini" role="status">{msg}</p>}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <h2 className="font-titre text-carte">Audios</h2>
            {data!.audios.map((a) => (
              <AudioForm key={a.id} audio={a} onSave={(v) => run(() => adminSaveAudio(v), 'Audio enregistré.')} />
            ))}
            <details className="rounded-carte bg-surface p-5">
              <summary className="cursor-pointer text-corps">Ajouter un audio</summary>
              <AudioForm
                audio={{ title: '', description: '', audio_url: '', category: 'centering', duration_seconds: 150, is_active: true, position: data!.audios.length + 1 }}
                onSave={(v) => run(() => adminSaveAudio(v), 'Audio ajouté.')}
                bare
              />
            </details>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-titre text-carte">Programmation</h2>
            <div className="flex flex-col gap-3 rounded-carte bg-surface p-5 sm:flex-row sm:items-end">
              <label className="flex-1 text-mini text-encre/70">Date
                <input type="date" className="champ mt-1" value={schedDate} min={today} onChange={(e) => setSchedDate(e.target.value)} />
              </label>
              <label className="flex-1 text-mini text-encre/70">Audio
                <select className="champ mt-1" value={schedAudio} onChange={(e) => setSchedAudio(e.target.value)}>
                  <option value="">Choisir…</option>
                  {data!.audios.filter((a) => a.is_active).map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </label>
              <button className="btn-vert" disabled={!schedAudio} onClick={() => run(() => adminSetSchedule(schedDate, schedAudio), 'Programmation enregistrée.')}>Programmer</button>
            </div>
            {data!.schedule.length === 0 ? (
              <p className="text-mini text-encre/60">Aucune programmation à venir : rotation automatique.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-encre/[0.07] rounded-carte bg-surface px-5">
                {data!.schedule.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-mini">{formatShortDate(s.scheduled_date)} · {data!.audios.find((a) => a.id === s.exercise_id)?.title ?? 'Audio supprimé'}</span>
                    <button className="text-mini text-sos underline" onClick={() => run(() => adminDeleteSchedule(s.id), 'Programmation retirée.')}>Retirer</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function AudioForm({ audio, onSave, bare = false }: { audio: Partial<AudioExercise>; onSave: (a: Partial<AudioExercise>) => void; bare?: boolean }) {
  const [v, setV] = useState(audio);
  const set = <K extends keyof AudioExercise>(k: K, val: AudioExercise[K]) => setV((x) => ({ ...x, [k]: val }));
  return (
    <form
      className={`grid gap-3 ${bare ? 'mt-4' : 'rounded-carte bg-surface p-5'}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(v);
      }}
    >
      <input className="champ" placeholder="Titre" value={v.title ?? ''} onChange={(e) => set('title', e.target.value)} required />
      <textarea className="champ" placeholder="Description" value={v.description ?? ''} onChange={(e) => set('description', e.target.value)} />
      <input className="champ" placeholder="URL de l’audio" type="url" value={v.audio_url ?? ''} onChange={(e) => set('audio_url', e.target.value)} required />
      <div className="grid grid-cols-3 gap-3">
        <label className="text-mini text-encre/70">Durée (s)
          <input className="champ mt-1" type="number" min={1} value={v.duration_seconds ?? 0} onChange={(e) => set('duration_seconds', Number(e.target.value))} required />
        </label>
        <label className="text-mini text-encre/70">Position
          <input className="champ mt-1" type="number" value={v.position ?? 0} onChange={(e) => set('position', Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-mini text-encre/70">Actif
          <input type="checkbox" className="mt-3 h-6 w-6 accent-[#506662]" checked={v.is_active ?? true} onChange={(e) => set('is_active', e.target.checked)} />
        </label>
      </div>
      <button className="btn-vert" type="submit">Enregistrer</button>
    </form>
  );
}
