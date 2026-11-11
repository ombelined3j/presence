import { useMemo, useState } from 'react';
import DojoCard from '../components/DojoCard';
import { Chip, EmptyState, ErrorBox, Loader, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { fetchCompletions, fetchExercises } from '../services/exercises';
import { formatShortDate } from '../utils/dates';

const ORDER = { debutant: 0, intermediaire: 1, avance: 2 } as const;

export default function DojoPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState('Toutes');
  const { data, loading, error, reload } = useAsync(async () => {
    const [exercises, completions] = await Promise.all([fetchExercises(), fetchCompletions(user!.id)]);
    return { exercises, completions };
  }, [user?.id]);

  const categories = useMemo(() => ['Toutes', ...new Set((data?.exercises ?? []).map((e) => e.category))], [data]);
  const doneIds = new Set((data?.completions ?? []).map((c) => c.exercise_id));
  const list = (data?.exercises ?? [])
    .filter((e) => category === 'Toutes' || e.category === category)
    .sort((a, b) => ORDER[a.difficulty_level] - ORDER[b.difficulty_level]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader kicker="Dojo" title="S’entraîner" highlight="sans enjeu.">
        Des mises en situation pour essayer d’autres réponses, à votre rythme, avant de les vivre pour de vrai.
      </PageHeader>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
            ))}
          </div>
          {list.length === 0 ? (
            <EmptyState title="Aucun exercice pour l’instant">De nouvelles mises en situation arriveront bientôt.</EmptyState>
          ) : (
            <div className="flex flex-col gap-3">
              {list.map((e) => <DojoCard key={e.id} exercise={e} done={doneIds.has(e.id)} />)}
            </div>
          )}

          <section>
            <h2 className="mb-3 font-titre text-carte">Mes entraînements</h2>
            {data!.completions.length === 0 ? (
              <EmptyState title="Pas encore d’entraînement">Choisissez une situation ci-dessus pour commencer.</EmptyState>
            ) : (
              <ul className="flex flex-col divide-y divide-encre/[0.07] rounded-carte bg-surface px-5">
                {data!.completions.map((c) => (
                  <li key={c.id} className="py-3.5">
                    <p className="text-corps">{c.exercises?.title ?? 'Exercice'}</p>
                    <p className="text-mini text-encre/55">{c.exercises?.category} · {formatShortDate(c.completed_at)}</p>
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
