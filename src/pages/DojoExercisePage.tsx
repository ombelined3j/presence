import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DIFFICULTY_LABEL } from '../components/DojoCard';
import { CheckIcon } from '../components/Icons';
import { EmptyState, ErrorBox, Loader, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { toMessage } from '../services/errors';
import { fetchExercise, saveCompletion } from '../services/exercises';

type Stage = 'intro' | 'step' | 'reflection' | 'review';

export default function DojoExercisePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: exercise, loading, error, reload } = useAsync(() => fetchExercise(id!), [id]);
  const [stage, setStage] = useState<Stage>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!exercise) {
    return (
      <>
        <PageHeader kicker="Dojo" title="Exercice introuvable" back="/app/dojo" />
        <EmptyState title="Cet exercice n’est plus disponible" />
      </>
    );
  }

  const { content } = exercise;
  const step = content.steps[stepIndex];

  const next = () => {
    if (picked === null) return;
    const all = [...choices];
    all[stepIndex] = picked;
    setChoices(all);
    setPicked(null);
    if (stepIndex < content.steps.length - 1) setStepIndex(stepIndex + 1);
    else setStage('reflection');
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveCompletion(user.id, exercise.id, {
        choices: choices.map((c, i) => ({ step: i, option: c, tone: content.steps[i].options[c]?.tone })),
        reflections: content.reflection.map((q, i) => ({ question: q, answer: reflections[i] ?? '' })),
      });
      setStage('review');
    } catch (e) {
      setSaveError(toMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader kicker={`Dojo · ${exercise.category} · ${DIFFICULTY_LABEL[exercise.difficulty_level]}`} title={exercise.title} back="/app/dojo" />

      {stage === 'intro' && (
        <>
          <section className="rounded-carte bg-sable p-6">
            <p className="text-mini text-encre/70">La situation</p>
            <p className="mt-1 text-corps">{content.context}</p>
            <p className="mt-4 text-mini text-encre/70">Objectif</p>
            <p className="mt-1 text-corps">{content.goal}</p>
          </section>
          <p className="text-mini text-encre/65">Il n’y a pas de note. Essayez, observez ce que chaque réponse produit.</p>
          <button className="btn-vert" onClick={() => setStage('step')}>Commencer la mise en situation</button>
        </>
      )}

      {stage === 'step' && step && (
        <>
          <p className="text-mini text-encre/60">Échange {stepIndex + 1} sur {content.steps.length}</p>
          <div className="max-w-[90%] rounded-carte rounded-tl-md bg-lilas p-5 font-titre text-carte">{step.other_says}</div>
          <p className="text-corps">{step.prompt}</p>
          <div className="flex flex-col gap-2">
            {step.options.map((o, i) => (
              <button
                key={i}
                onClick={() => setPicked(i)}
                aria-pressed={picked === i}
                className={`rounded-2xl border px-4 py-3.5 text-left text-corps transition ${picked === i ? 'border-vert bg-vert text-white' : 'border-encre/10 bg-white'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {picked !== null && (
            <div className={`rounded-carte p-5 ${step.options[picked].tone === 'ajuste' ? 'bg-vert/10' : 'bg-sable/60'}`} role="status">
              <p className="text-mini text-encre/70">{step.options[picked].tone === 'ajuste' ? 'Réponse ajustée' : 'Piste à explorer'}</p>
              <p className="mt-1 text-corps">{step.options[picked].feedback}</p>
            </div>
          )}
          <button className="btn-vert" disabled={picked === null} onClick={next}>
            {stepIndex < content.steps.length - 1 ? 'Échange suivant' : 'Prendre du recul'}
          </button>
          {picked !== null && <p className="text-center text-mini text-encre/55">Vous pouvez aussi essayer une autre réponse avant de continuer.</p>}
        </>
      )}

      {stage === 'reflection' && (
        <>
          <p className="font-titre text-[24px] leading-tight">Un moment de réflexion</p>
          {content.reflection.map((q, i) => (
            <div key={i}>
              <label htmlFor={`r${i}`} className="text-corps">{q}</label>
              <textarea id={`r${i}`} className="champ mt-2 min-h-[90px]" value={reflections[i] ?? ''} onChange={(e) => setReflections((r) => ({ ...r, [i]: e.target.value }))} />
            </div>
          ))}
          {saveError && <ErrorBox message={saveError} />}
          <button className="btn-vert" onClick={finish} disabled={saving}>{saving ? 'Enregistrement…' : 'Terminer l’exercice'}</button>
        </>
      )}

      {stage === 'review' && (
        <>
          <div className="rounded-carte bg-vert p-6 text-white">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-vert"><CheckIcon /></span>
            <p className="mt-3 font-titre text-carte">Entraînement terminé.</p>
            <p className="mt-1 text-corps text-white/85">Voici votre retour sur l’exercice.</p>
          </div>
          {content.steps.map((s, i) => {
            const o = s.options[choices[i]];
            return (
              <section key={i} className="rounded-carte bg-surface p-5">
                <p className="text-mini text-encre/60">Échange {i + 1}</p>
                <p className="mt-1 text-corps">Votre réponse : {o?.label}</p>
                <p className="mt-2 text-mini text-encre/75">{o?.feedback}</p>
                {o?.tone !== 'ajuste' && (
                  <p className="mt-2 text-mini text-vert">Une autre piste : {s.options.find((x) => x.tone === 'ajuste')?.label}</p>
                )}
              </section>
            );
          })}
          <Link to="/app/dojo" className="btn-vert">Retour au Dojo</Link>
        </>
      )}
    </div>
  );
}
