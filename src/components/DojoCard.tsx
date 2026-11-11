import { Link } from 'react-router-dom';
import type { Exercise } from '../types';
import { ArrowBadge } from './ui';
import { CheckIcon } from './Icons';

export const DIFFICULTY_LABEL = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' } as const;
const DIFFICULTY_COLOR = { debutant: 'bg-sable', intermediaire: 'bg-lilas', avance: 'bg-vert text-white' } as const;

export default function DojoCard({ exercise, done }: { exercise: Exercise; done: boolean }) {
  const dark = exercise.difficulty_level === 'avance';
  return (
    <Link to={`/app/dojo/${exercise.id}`} className={`block rounded-carte p-5 transition active:scale-[0.98] ${DIFFICULTY_COLOR[exercise.difficulty_level]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-mini ${dark ? 'text-white/75' : 'text-encre/70'}`}>
            {exercise.category} · {DIFFICULTY_LABEL[exercise.difficulty_level]} · {exercise.estimated_duration} min
          </p>
          <h3 className="mt-1 font-titre text-carte">{exercise.title}</h3>
          <p className={`mt-1 text-mini ${dark ? 'text-white/85' : 'text-encre/80'}`}>{exercise.description}</p>
        </div>
        <ArrowBadge tone={dark ? 'dark' : 'light'} />
      </div>
      {done && (
        <p className={`mt-3 inline-flex items-center gap-1.5 text-mini ${dark ? 'text-white/85' : 'text-vert'}`}>
          <CheckIcon /> Déjà pratiqué
        </p>
      )}
    </Link>
  );
}
