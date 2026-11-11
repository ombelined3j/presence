import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DiagnosticProgress from '../components/DiagnosticProgress';
import DiagnosticQuestion from '../components/DiagnosticQuestion';
import { ArrowLeft, ArrowUpRight } from '../components/Icons';
import { ErrorBox, Loader, Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { fetchDiagnosticQuestions, saveDiagnosticResult } from '../services/diagnostic';
import { toMessage } from '../services/errors';
import { computeDiagnostic } from '../utils/diagnostic';
import { savePendingDiagnostic } from '../utils/pendingDiagnostic';

export default function DiagnosticPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: questions, loading, error, reload } = useAsync(fetchDiagnosticQuestions, []);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (loading) return <Loader label="Préparation du diagnostic…" />;
  if (error || !questions) return <ErrorBox message={error ?? 'Diagnostic indisponible.'} onRetry={reload} />;

  if (!started) {
    return (
      <div className="flex flex-col gap-8">
        <Link to="/"><Wordmark /></Link>
        <section className="relative">
          <span className="pointer-events-none absolute -right-10 -top-4 h-28 w-28 rounded-full bg-lilas/70" aria-hidden />
          <p className="surtitre relative">Mini-diagnostic · gratuit</p>
          <h1 className="relative mt-3 text-titre">
            Comment réagissez-vous quand <span className="text-vert">ça se tend</span> ?
          </h1>
          <p className="relative mt-4 text-corps text-encre/80">
            {questions.length} questions courtes sur vos réactions habituelles dans les conversations difficiles. Il n’y a pas de bonne ou de mauvaise réponse : choisissez ce qui vous ressemble le plus souvent.
          </p>
        </section>
        <ul className="flex flex-col gap-2 text-mini text-encre/70">
          <li>Environ 2 minutes.</li>
          <li>Aucun compte n’est demandé pour voir votre résultat.</li>
          <li>Vous pourrez le refaire gratuitement quand vous voulez.</li>
        </ul>
        <button className="btn-vert" onClick={() => setStarted(true)}>
          Commencer <ArrowUpRight />
        </button>
        <p className="text-mini text-encre/55">Ces résultats sont des pistes de travail, pas un diagnostic psychologique ou médical.</p>
      </div>
    );
  }

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const canNext = Boolean(selected[q.id]);

  const finish = async () => {
    const result = computeDiagnostic(questions, selected);
    setSaving(true);
    setSaveError(null);
    try {
      if (user) {
        await saveDiagnosticResult(user.id, result);
      } else {
        savePendingDiagnostic(result);
      }
      navigate('/diagnostic/resultat', { state: { result, saved: Boolean(user) } });
    } catch (e) {
      setSaveError(toMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[80dvh] flex-col gap-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (index === 0 ? setStarted(false) : setIndex(index - 1))}
          className="inline-flex items-center gap-1 text-mini text-encre/70"
        >
          <ArrowLeft /> {index === 0 ? 'Introduction' : 'Question précédente'}
        </button>
      </div>
      <DiagnosticProgress current={index + 1} total={questions.length} />
      <DiagnosticQuestion
        key={q.id}
        question={q}
        selectedId={selected[q.id]}
        onSelect={(answerId) => setSelected((s) => ({ ...s, [q.id]: answerId }))}
      />
      {saveError && <ErrorBox message={saveError} />}
      <div className="mt-auto">
        <button
          className="btn-vert w-full"
          disabled={!canNext || saving}
          onClick={() => (isLast ? void finish() : setIndex(index + 1))}
        >
          {isLast ? (saving ? 'Calcul…' : 'Voir mon résultat') : 'Question suivante'}
        </button>
      </div>
    </div>
  );
}
