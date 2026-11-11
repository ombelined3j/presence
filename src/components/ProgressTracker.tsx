import type { DailySession } from '../types';
import { localDateISO } from '../utils/dates';

interface Props {
  sessions: DailySession[];
  dojoCount?: number;
}

// Suivi de la régularité sans compétition ni culpabilisation :
// pas de "série perdue", pas de rouge, seulement ce qui a été fait.
export default function ProgressTracker({ sessions, dojoCount = 0 }: Props) {
  const completed = sessions.filter((s) => s.status === 'completed');
  const practicedDays = new Set(completed.map((s) => s.session_date));
  const monthPrefix = localDateISO().slice(0, 7);
  const daysThisMonth = [...practicedDays].filter((d) => d.startsWith(monthPrefix)).length;
  const minutes = Math.round(completed.reduce((acc, s) => acc + s.duration_seconds, 0) / 60);

  const last14 = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const iso = localDateISO(d);
    return { iso, done: practicedDays.has(iso), label: d.toLocaleDateString('fr-FR', { weekday: 'narrow' }) };
  });

  return (
    <section className="rounded-carte bg-surface p-5" aria-label="Suivi de la pratique">
      <p className="surtitre">Votre pratique</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Stat value={completed.length} label={completed.length > 1 ? 'séances' : 'séance'} />
        <Stat value={daysThisMonth} label={daysThisMonth > 1 ? 'jours ce mois-ci' : 'jour ce mois-ci'} />
        <Stat value={minutes} label="minutes" />
      </div>
      <div className="mt-5">
        <p className="text-mini text-encre/60">Les 14 derniers jours</p>
        <ol className="mt-2 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
          {last14.map((d) => (
            <li key={d.iso} className="flex flex-col items-center gap-1">
              <span
                className={`h-6 w-full max-w-[22px] rounded-full ${d.done ? 'bg-vert' : 'bg-encre/[0.07]'}`}
                title={d.done ? `${d.iso} : pratiqué` : d.iso}
              />
              <span className="text-[11px] text-encre/45" aria-hidden>{d.label}</span>
            </li>
          ))}
        </ol>
        <span className="sr-only">{last14.filter((d) => d.done).length} jours pratiqués sur les 14 derniers jours.</span>
      </div>
      {dojoCount > 0 && <p className="mt-4 text-mini text-encre/70">{dojoCount} entraînement{dojoCount > 1 ? 's' : ''} au Dojo.</p>}
      <p className="mt-4 text-mini text-encre/60">
        {completed.length === 0
          ? 'Votre première séance vous attend, quand vous le souhaitez.'
          : 'Chaque séance compte, même espacée. Revenez quand c’est le bon moment pour vous.'}
      </p>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-fond px-2 py-3">
      <p className="font-titre text-[28px] leading-none text-vert">{value}</p>
      <p className="mt-1 text-[13px] leading-tight text-encre/70">{label}</p>
    </div>
  );
}
