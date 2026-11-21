import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DiagnosticProgress from '../components/DiagnosticProgress';
import DiagnosticQuestion from '../components/DiagnosticQuestion';
import { ArrowLeft, ArrowUpRight } from '../components/Icons';
import { ErrorBox, Loader, Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { envoyerResultatParEmail, fetchDiagnosticQuestions, saveDiagnosticResult } from '../services/diagnostic';
import { toMessage } from '../services/errors';
import { computeDiagnostic } from '../utils/diagnostic';
import { savePendingDiagnostic } from '../utils/pendingDiagnostic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DiagnosticPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: questions, loading, error, reload } = useAsync(fetchDiagnosticQuestions, []);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [etapeEmail, setEtapeEmail] = useState(false);
  const [email, setEmail] = useState('');
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
          <p className="surtitre relative">Diagnostic gratuit</p>
          <h1 className="relative mt-3 text-titre">
            Comment réagissez-vous quand <span className="text-vert">ça se tend</span> ?
          </h1>
          <p className="relative mt-4 text-corps text-encre/80">
            {questions.length} affirmations sur vos réactions dans les conversations difficiles. Pour chacune, indiquez si vous êtes d’accord ou non. Il n’y a pas de bonne ou de mauvaise réponse.
          </p>
        </section>
        <ul className="flex flex-col gap-2 text-mini text-encre/70">
          <li>Environ 2 minutes.</li>
          <li>Vous recevez votre résultat par e-mail.</li>
          <li>Vous pourrez le refaire gratuitement quand vous voulez.</li>
        </ul>
        <button className="btn-vert" onClick={() => setStarted(true)}>
          Commencer <ArrowUpRight />
        </button>
        <p className="text-mini text-encre/55">Ces résultats sont des pistes de travail, pas un diagnostic psychologique ou médical.</p>
      </div>
    );
  }

  const finish = async (e: FormEvent) => {
    e.preventDefault();
    const adresse = email.trim();
    if (!EMAIL_RE.test(adresse)) {
      setSaveError('Indiquez une adresse e-mail valide.');
      return;
    }
    const result = computeDiagnostic(questions, selected);
    setSaving(true);
    setSaveError(null);
    try {
      const [envoi] = await Promise.all([
        envoyerResultatParEmail(adresse, result),
        user ? saveDiagnosticResult(user.id, result) : Promise.resolve(savePendingDiagnostic(result)),
      ]);
      navigate('/diagnostic/resultat', { state: { result, saved: Boolean(user), email: adresse, envoi } });
    } catch (err) {
      setSaveError(toMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (etapeEmail) {
    return (
      <form className="flex min-h-[80dvh] flex-col gap-8" onSubmit={finish} noValidate>
        <div>
          <button type="button" onClick={() => setEtapeEmail(false)} className="inline-flex items-center gap-1 text-mini text-encre/70">
            <ArrowLeft /> Question précédente
          </button>
        </div>
        <section>
          <p className="surtitre">Dernière étape</p>
          <h1 className="mt-3 text-titre">
            Où vous envoyer <span className="text-vert">votre résultat</span> ?
          </h1>
          <p className="mt-4 text-corps text-encre/80">
            Indiquez votre adresse e-mail pour découvrir votre résultat. Vous le recevez aussi par e-mail.
          </p>
        </section>
        <label className="flex flex-col gap-2">
          <span className="text-mini text-encre/70">Votre adresse e-mail</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="rounded-2xl border border-encre/15 bg-white px-4 py-3.5 text-corps outline-none focus:border-vert"
            placeholder="vous@exemple.com"
          />
        </label>
        <p className="rounded-carte bg-surface p-4 text-mini text-encre/75">
          En envoyant votre adresse e-mail, vous recevez votre résultat par e-mail et vous vous inscrivez à la newsletter de Présence Authentique. Vous pouvez vous désinscrire à tout moment, depuis le lien présent dans chaque e-mail.
        </p>
        {saveError && <ErrorBox message={saveError} />}
        <div className="mt-auto">
          <button type="submit" className="btn-vert w-full" disabled={saving}>
            {saving ? 'Calcul…' : 'Voir mon résultat'}
          </button>
        </div>
      </form>
    );
  }

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const canNext = Boolean(selected[q.id]);

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
      <div className="mt-auto">
        <button
          className="btn-vert w-full"
          disabled={!canNext}
          onClick={() => {
            if (!isLast) return setIndex(index + 1);
            if (user?.email && !email) setEmail(user.email);
            setEtapeEmail(true);
          }}
        >
          {isLast ? 'Continuer' : 'Question suivante'}
        </button>
      </div>
    </div>
  );
}
