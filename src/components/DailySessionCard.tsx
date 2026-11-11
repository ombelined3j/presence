import { Link } from 'react-router-dom';
import type { AudioExercise, SessionMode } from '../types';
import { formatMinutes } from '../utils/dates';
import { ArrowUpRight, CheckIcon } from './Icons';

interface DailySessionCardProps {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
  audio: AudioExercise | null;
  doneToday: boolean;
}

// Bloc principal du tableau de bord : toujours l'élément le plus visible.
export default function DailySessionCard({ mode, onModeChange, audio, doneToday }: DailySessionCardProps) {
  const centering = mode === 'centering';
  return (
    <section aria-labelledby="seance-du-jour" className="relative overflow-hidden rounded-carte bg-vert p-6 text-white">
      <span className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-lilas" aria-hidden />

      <div className="relative mb-5 inline-flex max-w-full rounded-full bg-white/15 p-1 text-mini" role="tablist" aria-label="Mode de la séance">
        <button
          role="tab"
          aria-selected={centering}
          onClick={() => onModeChange('centering')}
          className={`rounded-full px-4 py-2 transition ${centering ? 'bg-white text-encre' : 'text-white/85'}`}
        >
          Ancrage
        </button>
        <button
          role="tab"
          aria-selected={!centering}
          onClick={() => onModeChange('difficult_situation')}
          className={`rounded-full px-4 py-2 transition ${!centering ? 'bg-white text-encre' : 'text-white/85'}`}
        >
          Préparer une situation
        </button>
      </div>

      <p className="relative text-mini text-white/80" id="seance-du-jour">
        Séance du jour · {centering ? (audio ? formatMinutes(audio.duration_seconds) : 'environ 5 min') : 'environ 5 min'}
      </p>
      <h2 className="relative mt-1 font-titre text-carte">
        {centering ? (audio ? audio.title : 'Votre ancrage du matin') : 'Préparer une conversation qui vous préoccupe'}
      </h2>
      <p className="relative mt-2 text-mini text-white/80">
        {centering
          ? audio?.description || 'Quelques minutes pour vous ancrer avant la journée.'
          : 'Clarifier ce que vous ressentez, ce que vous voulez dire, et comment écouter l’autre.'}
      </p>

      {doneToday && centering && (
        <p className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-mini">
          <CheckIcon /> Séance faite aujourd’hui. Vous pouvez la refaire si vous le souhaitez.
        </p>
      )}

      <Link
        to={centering ? '/app/seance' : '/app/seance/preparer'}
        className="btn-blanc relative mt-6 w-full sm:w-auto"
      >
        {centering ? 'Commencer ma séance' : 'Préparer ma situation'} <ArrowUpRight />
      </Link>
    </section>
  );
}
