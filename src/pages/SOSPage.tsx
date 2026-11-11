import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import BreathingGuide from '../components/BreathingGuide';
import { ArrowUpRight, CheckIcon } from '../components/Icons';
import { Chip, Disclaimer, ErrorBox, PageHeader } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { toMessage } from '../services/errors';
import { saveSituation } from '../services/situations';

type Stage = 'emotion' | 'breathe' | 'situation' | 'questions' | 'suggestions' | 'reply' | 'done';

const EMOTIONS = ['Colère', 'Peur', 'Tristesse', 'Honte', 'Confusion', 'Submergé, submergée'];

const SUGGESTIONS: Record<string, string[]> = {
  Colère: ['Rien ne vous oblige à répondre tout de suite.', 'Écrivez ce que vous aimeriez dire, sans l’envoyer.', 'Repérez le besoin derrière la colère : respect, justice, reconnaissance ?'],
  Peur: ['Nommez ce que vous craignez le plus, précisément.', 'Rappelez-vous ce que vous maîtrisez dans la situation.', 'Une seule phrase claire vaut mieux qu’un long discours.'],
  Tristesse: ['Accordez-vous un moment avant de reprendre la conversation.', 'Ce que vous ressentez est légitime.', 'Pensez à une personne de confiance à qui en parler.'],
  Honte: ['Une erreur ou une critique ne dit pas qui vous êtes.', 'Parlez-vous comme vous parleriez à une personne que vous aimez.', 'Distinguez ce qui a été dit de ce que vous en concluez sur vous.'],
  Confusion: ['Notez les faits, séparément de vos interprétations.', 'Posez une question pour clarifier avant de répondre.', 'Vous pouvez dire : « Tu peux reformuler ? Je veux bien comprendre. »'],
  default: ['Faites une pause : quelques respirations, un verre d’eau.', 'Une seule priorité : ne pas aggraver la situation.', 'Vous pouvez revenir vers l’autre plus tard, avec plus de recul.'],
};

const REPLIES = [
  'J’ai besoin d’un moment pour y réfléchir. On peut en reparler plus tard ?',
  'Je t’entends. Je ne suis pas d’accord, et je voudrais t’expliquer pourquoi, calmement.',
  'Là, je sens que ça monte. Je préfère qu’on fasse une pause et qu’on reprenne dans un moment.',
  'Est-ce que tu peux m’en dire plus sur ce qui te fait réagir comme ça ?',
];

const QUESTIONS = [
  { key: 'urgent', q: 'Avez-vous vraiment besoin de répondre maintenant ?' },
  { key: 'stake', q: 'Qu’est-ce qui est le plus important pour vous, là, tout de suite ?' },
  { key: 'next', q: 'Quel serait un petit pas apaisant dans l’heure qui vient ?' },
];

export default function SOSPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('emotion');
  const [emotion, setEmotion] = useState('');
  const [situation, setSituation] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toSituation = useCallback(() => setStage('situation'), []);

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await saveSituation({
        userId: user.id,
        description: situation.trim() || 'Moment SOS',
        emotionalState: emotion || null,
        context: 'sos',
        preparationData: { answers, reply: reply.trim() },
      });
      setStage('done');
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const tips = SUGGESTIONS[emotion] ?? SUGGESTIONS.default;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader kicker="SOS" title="Prenons ce moment," highlight="pas à pas." back="/app" />

      {stage === 'emotion' && (
        <>
          <p className="font-titre text-[24px] leading-tight">Qu’est-ce qui domine, là, maintenant ?</p>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((e) => (
              <Chip key={e} active={emotion === e} onClick={() => setEmotion(e)}>{e}</Chip>
            ))}
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-sos px-6 py-4 text-corps text-encre transition active:scale-[0.98]" onClick={() => setStage('breathe')}>
            {emotion ? 'Respirer une minute' : 'Je ne sais pas, respirer d’abord'}
          </button>
        </>
      )}

      {stage === 'breathe' && (
        <>
          <p className="text-corps text-encre/80">Une minute pour faire redescendre la tension. Suivez simplement le cercle.</p>
          <BreathingGuide onDone={toSituation} />
          <button className="btn-ligne" onClick={toSituation}>Passer</button>
        </>
      )}

      {stage === 'situation' && (
        <>
          <label htmlFor="sos-desc" className="font-titre text-[24px] leading-tight">Que se passe-t-il ?</label>
          <textarea id="sos-desc" className="champ min-h-[110px]" placeholder="Quelques mots suffisent (facultatif)." value={situation} onChange={(e) => setSituation(e.target.value)} />
          <button className="btn-vert" onClick={() => setStage('questions')}>Continuer</button>
        </>
      )}

      {stage === 'questions' && (
        <>
          <p className="text-corps text-encre/80">Trois questions pour retrouver un peu de clarté. Répondez dans votre tête ou par écrit.</p>
          {QUESTIONS.map(({ key, q }) => (
            <div key={key}>
              <label htmlFor={key} className="font-titre text-carte">{q}</label>
              <input id={key} className="champ mt-2" value={answers[key] ?? ''} onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))} />
            </div>
          ))}
          <button className="btn-vert" onClick={() => setStage('suggestions')}>Continuer</button>
        </>
      )}

      {stage === 'suggestions' && (
        <>
          <p className="font-titre text-[24px] leading-tight">Quelques repères{emotion ? ` quand on ressent : ${emotion.toLowerCase()}` : ''}</p>
          <ul className="flex flex-col gap-3">
            {tips.map((t) => (
              <li key={t} className="rounded-carte bg-surface p-4 text-corps">{t}</li>
            ))}
          </ul>
          <button className="btn-vert" onClick={() => setStage('reply')}>Préparer une réponse</button>
          <Link to="/app" className="text-center text-mini text-encre/60 underline underline-offset-4">Je me sens mieux, retour à l’accueil</Link>
        </>
      )}

      {stage === 'reply' && (
        <>
          <p className="font-titre text-[24px] leading-tight">Si vous devez répondre, une phrase suffit.</p>
          <div className="flex flex-col gap-2">
            {REPLIES.map((r) => (
              <button key={r} onClick={() => setReply(r)} className={`rounded-2xl border px-4 py-3 text-left text-corps ${reply === r ? 'border-vert bg-vert text-white' : 'border-encre/10 bg-white'}`}>
                {r}
              </button>
            ))}
          </div>
          <label htmlFor="reply" className="text-mini text-encre/70">Ou avec vos mots</label>
          <textarea id="reply" className="champ min-h-[90px]" value={reply} onChange={(e) => setReply(e.target.value)} />
          {error && <ErrorBox message={error} />}
          <button className="btn-vert" onClick={finish} disabled={saving}>{saving ? 'Enregistrement…' : 'Garder cette réponse'}</button>
        </>
      )}

      {stage === 'done' && (
        <>
          <div className="rounded-carte bg-vert p-6 text-white">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-vert"><CheckIcon /></span>
            <p className="mt-3 font-titre text-carte">Vous avez pris le temps de vous recentrer.</p>
            {reply && <p className="mt-3 text-corps text-white/90">« {reply} »</p>}
          </div>
          <Link to="/app/seance/preparer" className="btn-ligne">Préparer la suite de la conversation <ArrowUpRight /></Link>
          <Link to="/app" className="btn-vert">Retour à l’accueil</Link>
        </>
      )}

      <section className="rounded-2xl bg-surface p-4 text-mini text-encre/70">
        <p>En cas de danger ou de détresse intense, contactez le 112 (urgences) ou le 3114 (prévention du suicide, 24 h/24, gratuit).</p>
        <Disclaimer className="mt-2" />
      </section>
    </div>
  );
}
