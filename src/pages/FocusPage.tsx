import { useState } from 'react';
import { Link } from 'react-router-dom';
import FocusCard from '../components/FocusCard';
import SessionHistory from '../components/SessionHistory';
import { ArrowBadge, EmptyState, ErrorBox, Loader, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { fetchActiveAudios, fetchSessions } from '../services/sessions';
import { fetchSituations } from '../services/situations';
import { formatClock, formatShortDate } from '../utils/dates';

type Tab = 'centrage' | 'situation';
const COLORS = ['bg-vert text-white', 'bg-sable', 'bg-lilas', 'bg-surface', 'bg-sable'];

export default function FocusPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('centrage');
  const { data, loading, error, reload } = useAsync(async () => {
    const [audios, sessions, situations] = await Promise.all([fetchActiveAudios(), fetchSessions(user!.id, 100), fetchSituations(user!.id)]);
    return { audios, sessions, situations };
  }, [user?.id]);

  const listens = (data?.sessions ?? []).filter((s) => s.mode === 'centering');
  const preparations = (data?.situations ?? []).filter((s) => s.context !== 'sos');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader kicker="Focus" title="Choisissez votre" highlight="exercice." />

      <div className="inline-flex self-start rounded-full bg-surface p-1 text-mini" role="tablist">
        {(['centrage', 'situation'] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2.5 transition ${tab === t ? 'bg-vert text-white' : 'text-encre/75'}`}>
            {t === 'centrage' ? 'Centrage' : 'Situation difficile'}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : tab === 'centrage' ? (
        <>
          {data!.audios.length === 0 ? (
            <EmptyState title="Aucun audio disponible" />
          ) : (
            <div className="flex flex-col gap-3">
              {data!.audios.map((a, i) => {
                const dark = i % COLORS.length === 0;
                return (
                  <Link key={a.id} to={`/app/focus/audio/${a.id}`} className={`flex items-start justify-between gap-3 rounded-carte p-5 transition active:scale-[0.98] ${COLORS[i % COLORS.length]}`}>
                    <div>
                      <p className={`text-mini ${dark ? 'text-white/75' : 'text-encre/70'}`}>{formatClock(a.duration_seconds)}</p>
                      <h3 className="mt-1 font-titre text-carte">{a.title}</h3>
                      <p className={`mt-1 text-mini ${dark ? 'text-white/85' : 'text-encre/80'}`}>{a.description}</p>
                    </div>
                    <ArrowBadge tone={dark ? 'dark' : 'light'} />
                  </Link>
                );
              })}
            </div>
          )}
          <section>
            <h2 className="mb-3 font-titre text-carte">Historique des écoutes</h2>
            <SessionHistory sessions={listens} limit={10} />
          </section>
        </>
      ) : (
        <>
          <FocusCard to="/app/focus/situation" kicker="Préparation personnalisée" title="Décrire une situation et la préparer" text="Clarifier vos pensées, vos besoins et vos mots." color="sable" />
          <section>
            <h2 className="mb-3 font-titre text-carte">Mes préparations</h2>
            {preparations.length === 0 ? (
              <EmptyState title="Aucune préparation pour l’instant" />
            ) : (
              <ul className="flex flex-col gap-3">
                {preparations.map((p) => {
                  const opening = typeof p.preparation_data.opening === 'string' ? p.preparation_data.opening : '';
                  return (
                    <li key={p.id} className="rounded-carte bg-surface p-5">
                      <p className="text-mini text-encre/55">{formatShortDate(p.created_at)}{p.person_involved ? ` · ${p.person_involved}` : ''}</p>
                      <p className="mt-1 text-corps">{p.description}</p>
                      {opening && <p className="mt-2 text-mini text-vert">« {opening} »</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
