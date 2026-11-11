import type { DailySession } from '../types';
import { formatClock, formatShortDate } from '../utils/dates';
import { EmptyState } from './ui';

const STATUS = { completed: 'Terminée', interrupted: 'Interrompue', started: 'Non terminée' } as const;

export default function SessionHistory({ sessions, limit }: { sessions: DailySession[]; limit?: number }) {
  const list = limit ? sessions.slice(0, limit) : sessions;
  if (list.length === 0) {
    return <EmptyState title="Aucune séance pour l’instant">Votre historique apparaîtra ici après votre première séance.</EmptyState>;
  }
  return (
    <ul className="flex flex-col divide-y divide-encre/[0.07] rounded-carte bg-surface px-5">
      {list.map((s) => (
        <li key={s.id} className="flex items-center justify-between gap-3 py-3.5">
          <div className="min-w-0">
            <p className="truncate text-corps">
              {s.mode === 'centering' ? s.audio_exercises?.title ?? 'Ancrage' : 'Préparation d’une situation'}
            </p>
            <p className="text-mini text-encre/55">
              {formatShortDate(s.session_date)} · {s.source === 'focus' ? 'Focus' : 'Séance du jour'} · {formatClock(s.duration_seconds)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[13px] ${
              s.status === 'completed' ? 'bg-vert/10 text-vert' : 'bg-encre/[0.06] text-encre/60'
            }`}
          >
            {STATUS[s.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
