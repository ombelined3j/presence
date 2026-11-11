import { REFLEX_PROFILES } from '../data/reflexes';
import { REFLEX_TYPES, type ReflexScores, type ReflexType } from '../types';

interface Props {
  dominant: ReflexType;
  secondary: ReflexType | null;
  scores: ReflexScores;
  compact?: boolean;
}

export default function DiagnosticResult({ dominant, secondary, scores, compact = false }: Props) {
  const main = REFLEX_PROFILES[dominant];
  const second = secondary ? REFLEX_PROFILES[secondary] : null;
  const total = Math.max(1, Object.values(scores).reduce((a, b) => a + b, 0));

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-carte bg-vert p-6 text-white">
        <p className="text-mini text-white/80">Votre réflexe principal</p>
        <h2 className="mt-1 font-titre text-[28px] leading-tight">{main.label}</h2>
        <p className="mt-1 text-corps text-white/90">{main.short}</p>
        {!compact && <p className="mt-4 text-corps text-white/85">{main.description}</p>}
      </section>

      {second && (
        <section className="rounded-carte bg-lilas p-5">
          <p className="text-mini text-encre/70">Réflexe secondaire</p>
          <h3 className="mt-1 font-titre text-carte">{second.label}</h3>
          <p className="mt-1 text-mini text-encre/80">{second.short}</p>
        </section>
      )}

      <section className="rounded-carte bg-surface p-5">
        <p className="surtitre">Vos réflexes</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {REFLEX_TYPES.map((r) => (
            <li key={r} className="flex items-center gap-3 text-mini">
              <span className="w-24 shrink-0">{REFLEX_PROFILES[r].label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-encre/10">
                <span className="block h-full rounded-full bg-vert" style={{ width: `${(scores[r] / total) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {!compact && (
        <>
          <section className="rounded-carte bg-sable p-5">
            <p className="text-mini text-encre/70">Votre ressource</p>
            <p className="mt-1 text-corps">{main.strength}</p>
          </section>
          <section className="rounded-carte bg-surface p-5">
            <p className="surtitre">Vos axes de progression</p>
            <ul className="mt-3 flex flex-col gap-2">
              {main.axes.map((a) => (
                <li key={a} className="flex gap-3 text-corps">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-vert" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
      <p className="text-mini text-encre/55">
        Ces résultats sont des pistes de travail, pas un diagnostic psychologique ou médical.
      </p>
    </div>
  );
}
