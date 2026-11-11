import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DiagnosticResult from '../components/DiagnosticResult';
import ProfileSettings from '../components/ProfileSettings';
import ProgressTracker from '../components/ProgressTracker';
import SessionHistory from '../components/SessionHistory';
import { ArrowUpRight } from '../components/Icons';
import { Disclaimer, EmptyState, ErrorBox, Loader, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { REFLEX_PROFILES } from '../data/reflexes';
import { useAsync } from '../hooks/useAsync';
import { fetchDiagnosticHistory } from '../services/diagnostic';
import { toMessage } from '../services/errors';
import { fetchCompletions } from '../services/exercises';
import { deleteMyAccount, exportMyData } from '../services/profile';
import { fetchSessions } from '../services/sessions';
import { formatShortDate } from '../utils/dates';

export default function ProfilePage() {
  const { user, profile, setProfile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(async () => {
    const [diagnostics, sessions, completions] = await Promise.all([
      fetchDiagnosticHistory(user!.id),
      fetchSessions(user!.id, 200),
      fetchCompletions(user!.id),
    ]);
    return { diagnostics, sessions, completions };
  }, [user?.id]);

  const [showAll, setShowAll] = useState(false);
  const [dataMsg, setDataMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [deleting, setDeleting] = useState(false);

  const logout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const download = async () => {
    setDataMsg(null);
    try {
      const json = await exportMyData(user!.id);
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presence-mes-donnees.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setDataMsg(toMessage(e));
    }
  };

  const removeAccount = async () => {
    setDeleting(true);
    setDataMsg(null);
    try {
      await deleteMyAccount();
      await signOut();
      navigate('/', { replace: true });
    } catch (e) {
      setDataMsg(toMessage(e));
      setDeleting(false);
    }
  };

  const latest = data?.diagnostics[0];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader kicker="Profil" title={profile?.first_name ? `${profile.first_name},` : 'Votre'} highlight={profile?.first_name ? 'votre progression.' : 'progression.'} />

      <section className="rounded-carte bg-surface p-5">
        <p className="surtitre">Compte</p>
        <p className="mt-3 text-corps">{user?.email}</p>
        {profile && <p className="text-mini text-encre/55">Membre depuis le {formatShortDate(profile.created_at)}</p>}
      </section>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-titre text-carte">Mon diagnostic</h2>
              <Link to="/diagnostic" className="text-mini text-vert underline underline-offset-4">Refaire (gratuit)</Link>
            </div>
            {latest ? (
              <>
                <p className="text-mini text-encre/55">Dernier passage le {formatShortDate(latest.completed_at)}</p>
                <DiagnosticResult dominant={latest.dominant_reflex} secondary={latest.secondary_reflex} scores={latest.result_data.scores} compact />
              </>
            ) : (
              <EmptyState title="Pas encore de diagnostic">
                <Link to="/diagnostic" className="text-vert underline underline-offset-4">Faire mon diagnostic</Link>
              </EmptyState>
            )}
            {data!.diagnostics.length > 1 && (
              <div className="rounded-carte bg-surface p-5">
                <p className="surtitre">Historique des diagnostics</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {data!.diagnostics.map((d) => (
                    <li key={d.id} className="flex justify-between gap-3 text-mini">
                      <span>{formatShortDate(d.completed_at)}</span>
                      <span className="text-encre/75">
                        {REFLEX_PROFILES[d.dominant_reflex].label}
                        {d.secondary_reflex ? ` puis ${REFLEX_PROFILES[d.secondary_reflex].label.toLowerCase()}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <ProgressTracker sessions={data!.sessions} dojoCount={data!.completions.length} />

          <section>
            <h2 className="mb-3 font-titre text-carte">Historique des séances</h2>
            <SessionHistory sessions={data!.sessions} limit={showAll ? undefined : 8} />
            {data!.sessions.length > 8 && (
              <button className="mt-3 text-mini text-vert underline underline-offset-4" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Afficher moins' : `Afficher les ${data!.sessions.length} séances`}
              </button>
            )}
          </section>
        </>
      )}

      {profile && <ProfileSettings profile={profile} onSaved={setProfile} />}

      <section className="rounded-carte bg-surface p-5">
        <p className="surtitre">Mes données personnelles</p>
        <p className="mt-3 text-mini text-encre/70">Vos données ne sont visibles que par vous. Vous pouvez les télécharger ou supprimer définitivement votre compte.</p>
        <button className="btn-ligne mt-4 w-full" onClick={download}>Télécharger mes données</button>
        <details className="mt-4">
          <summary className="cursor-pointer text-mini text-encre/70">Supprimer mon compte</summary>
          <p className="mt-3 text-mini text-encre/70">
            Cette action est définitive : profil, diagnostics, séances et préparations seront supprimés. Tapez SUPPRIMER pour confirmer.
          </p>
          <input className="champ mt-2" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} aria-label="Confirmation de suppression" />
          <button className="mt-3 w-full rounded-full border border-sos px-6 py-3.5 text-corps text-sos disabled:opacity-40" disabled={confirmDelete !== 'SUPPRIMER' || deleting} onClick={removeAccount}>
            {deleting ? 'Suppression…' : 'Supprimer définitivement'}
          </button>
        </details>
        {dataMsg && <p className="mt-3 text-mini text-sos" role="alert">{dataMsg}</p>}
      </section>

      {isAdmin && (
        <Link to="/admin" className="btn-ligne">Gérer la bibliothèque audio <ArrowUpRight /></Link>
      )}
      <button className="btn-encre" onClick={logout}>Se déconnecter</button>
      <Disclaimer />
    </div>
  );
}
