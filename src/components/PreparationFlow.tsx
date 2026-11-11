import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AUDIO_SEED } from '../data/audios';
import { activeProvider, CONCERNS, EMOTIONS, type PreparationPlan } from '../services/preparationEngine';
import { saveSituation } from '../services/situations';
import { fetchActiveAudios, startSession, updateSessionStatus } from '../services/sessions';
import { toMessage } from '../services/errors';
import type { AudioExercise, SessionSource } from '../types';
import { formatClock } from '../utils/dates';
import AudioPlayer from './AudioPlayer';
import DiagnosticProgress from './DiagnosticProgress';
import { ArrowLeft, ArrowUpRight, CheckIcon } from './Icons';
import { Chip, Disclaimer, ErrorBox } from './ui';

type Stage = 'describe' | 'plan' | 'steps' | 'summary' | 'done';

export default function PreparationFlow({ source, backTo }: { source: SessionSource; backTo: string }) {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('describe');
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState('');
  const [concern, setConcern] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('');
  const [plan, setPlan] = useState<PreparationPlan | null>(null);
  const [anchor, setAnchor] = useState<AudioExercise | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [opening, setOpening] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Temps de préparation, compté à partir du moment où l'on décrit la situation.
  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (stage === 'done') return;
    const t = setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 1000);
    return () => clearInterval(t);
  }, [stage]);

  const toPlan = async () => {
    setError(null);
    if (description.trim().length < 5) {
      setError('Décrivez la situation en quelques mots pour continuer.');
      return;
    }
    const p = await activeProvider.buildPlan({ description, personInvolved: person, mainConcern: concern, emotion });
    setPlan(p);
    try {
      const audios = await fetchActiveAudios();
      const wanted = AUDIO_SEED.find((a) => a.key === p.anchorAudioKey)?.title;
      setAnchor(audios.find((a) => a.title === wanted) ?? audios.find((a) => a.duration_seconds <= 180) ?? null);
    } catch {
      setAnchor(null); // l'ancrage audio est facultatif
    }
    setStage('plan');
  };

  const steps = plan?.steps ?? [];
  const step = steps[stepIndex];

  const suggestedOpening = useMemo(() => answers.words?.trim() || answers.message?.trim() || '', [answers]);

  const finish = async () => {
    if (!user || !plan) return;
    setSaving(true);
    setError(null);
    try {
      const duration = Math.round((Date.now() - startedAt.current) / 1000);
      await saveSituation({
        userId: user.id,
        description: description.trim(),
        personInvolved: person.trim(),
        mainConcern: CONCERNS.find((c) => c.id === concern)?.label ?? null,
        emotionalState: emotion || null,
        context: source === 'focus' ? 'focus' : 'preparation',
        preparationData: {
          exercise: plan.exerciseTitle,
          answers,
          opening: opening.trim() || suggestedOpening,
          duration_seconds: duration,
        },
      });
      const session = await startSession({ userId: user.id, mode: 'difficult_situation', source });
      await updateSessionStatus(session.id, 'completed', duration);
      setStage('done');
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const timer = (
    <p className="text-mini text-encre/55 tabular-nums" aria-live="off">Temps de préparation : {formatClock(elapsed)}</p>
  );

  if (stage === 'describe') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="desc" className="font-titre text-[26px] leading-tight">Quelle conversation vous préoccupe ?</label>
          <textarea
            id="desc"
            className="champ mt-4 min-h-[120px]"
            placeholder="En quelques mots : de quoi s’agit-il, quand doit-elle avoir lieu…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="person" className="text-mini text-encre/70">Avec qui ? (facultatif)</label>
          <input id="person" className="champ mt-1" placeholder="Ma responsable, mon frère, Léa…" value={person} onChange={(e) => setPerson(e.target.value)} />
        </div>
        <div>
          <p className="text-mini text-encre/70">Ce qui vous inquiète le plus</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <Chip key={c.id} active={concern === c.id} onClick={() => setConcern(concern === c.id ? '' : c.id)}>{c.label}</Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-mini text-encre/70">Ce que vous ressentez maintenant</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EMOTIONS.map((e) => (
              <Chip key={e} active={emotion === e} onClick={() => setEmotion(emotion === e ? '' : e)}>{e}</Chip>
            ))}
          </div>
        </div>
        {error && <ErrorBox message={error} />}
        <button className="btn-vert" onClick={() => void toPlan()}>Continuer <ArrowUpRight /></button>
        <Disclaimer />
      </div>
    );
  }

  if (stage === 'plan' && plan) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => setStage('describe')} className="inline-flex items-center gap-1 self-start text-mini text-encre/70"><ArrowLeft /> Modifier la situation</button>
        <section className="rounded-carte bg-sable p-6">
          <p className="text-mini text-encre/70">Exercice proposé</p>
          <h2 className="mt-1 font-titre text-carte">{plan.exerciseTitle}</h2>
          <p className="mt-2 text-corps">{plan.exerciseIntro}</p>
          <p className="mt-3 text-mini text-encre/70">{plan.steps.length} étapes courtes, environ 5 minutes.</p>
        </section>
        {anchor && (
          <div>
            <p className="mb-2 text-mini text-encre/70">Facultatif : commencez par vous ancrer quelques instants.</p>
            <AudioPlayer src={anchor.audio_url} title={anchor.title} expectedSeconds={anchor.duration_seconds} tone="light" />
          </div>
        )}
        <button className="btn-vert" onClick={() => { setStepIndex(0); setStage('steps'); }}>Commencer la préparation <ArrowUpRight /></button>
        {timer}
      </div>
    );
  }

  if (stage === 'steps' && step) {
    const isLast = stepIndex === steps.length - 1;
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => (stepIndex === 0 ? setStage('plan') : setStepIndex(stepIndex - 1))}
          className="inline-flex items-center gap-1 self-start text-mini text-encre/70"
        >
          <ArrowLeft /> Étape précédente
        </button>
        <DiagnosticProgress current={stepIndex + 1} total={steps.length} />
        <div>
          <p className="surtitre">{step.title}</p>
          <label htmlFor={`step-${step.key}`} className="mt-2 block font-titre text-[26px] leading-tight">{step.question}</label>
          <p className="mt-3 text-mini text-encre/70">{step.hint}</p>
          <textarea
            id={`step-${step.key}`}
            key={step.key}
            className="champ mt-4 min-h-[130px]"
            placeholder={step.placeholder}
            value={answers[step.key] ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [step.key]: e.target.value }))}
          />
        </div>
        <button className="btn-vert" onClick={() => (isLast ? (setOpening(suggestedOpening), setStage('summary')) : setStepIndex(stepIndex + 1))}>
          {isLast ? 'Voir ma synthèse' : answers[step.key]?.trim() ? 'Étape suivante' : 'Passer cette étape'}
        </button>
        {timer}
      </div>
    );
  }

  if (stage === 'summary' && plan) {
    return (
      <div className="flex flex-col gap-5">
        <button onClick={() => setStage('steps')} className="inline-flex items-center gap-1 self-start text-mini text-encre/70"><ArrowLeft /> Revenir aux étapes</button>
        <header>
          <p className="surtitre">Synthèse personnelle</p>
          <h2 className="mt-2 text-titre">Ce que vous emportez <span className="text-vert">avec vous</span>.</h2>
        </header>
        <section className="rounded-carte bg-surface p-5">
          <p className="text-mini text-encre/60">La situation</p>
          <p className="mt-1 text-corps">{description}</p>
          {(person || emotion) && (
            <p className="mt-2 text-mini text-encre/60">{[person && `Avec : ${person}`, emotion && `Émotion : ${emotion}`].filter(Boolean).join(' · ')}</p>
          )}
        </section>
        {steps.filter((s) => answers[s.key]?.trim()).map((s) => (
          <section key={s.key} className="rounded-carte bg-surface p-5">
            <p className="text-mini text-encre/60">{s.title}</p>
            <p className="mt-1 whitespace-pre-line text-corps">{answers[s.key]}</p>
          </section>
        ))}
        <section className="rounded-carte bg-vert p-5 text-white">
          <label htmlFor="opening" className="text-mini text-white/80">Ma phrase pour commencer</label>
          <textarea
            id="opening"
            className="mt-2 min-h-[90px] w-full rounded-2xl bg-white/15 px-4 py-3 text-corps text-white placeholder:text-white/60 focus:outline-none"
            placeholder="La première phrase que vous direz…"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
          />
        </section>
        {error && <ErrorBox message={error} />}
        <button className="btn-vert" onClick={finish} disabled={saving}>{saving ? 'Enregistrement…' : 'Terminer ma préparation'}</button>
        {timer}
      </div>
    );
  }

  // done
  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="relative overflow-hidden rounded-carte bg-vert p-7 text-white">
        <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-lilas" aria-hidden />
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-vert"><CheckIcon /></span>
        <h2 className="relative mt-4 font-titre text-titre">Votre préparation est prête.</h2>
        <p className="relative mt-3 text-corps text-white/85">
          Préparation enregistrée ({formatClock(elapsed)}). Avant la conversation, relisez votre phrase et prenez trois respirations.
        </p>
      </div>
      {(opening.trim() || suggestedOpening) && (
        <blockquote className="rounded-carte bg-surface p-5 font-titre text-carte">« {opening.trim() || suggestedOpening} »</blockquote>
      )}
      <Link to={backTo} className="btn-vert">Retour</Link>
    </div>
  );
}
