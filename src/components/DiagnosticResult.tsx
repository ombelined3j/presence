import { REFLEX_PROFILES } from '../data/reflexes';
import { REFLEX_TYPES, type ReflexType } from '../types';

interface Props {
  principal: ReflexType[];
  secondaires: ReflexType[];
  compact?: boolean;
}

// Écran de résultat (page Notion « Contenu de l’app »), au vouvoiement.
export default function DiagnosticResult({ principal, secondaires, compact = false }: Props) {
  const plusieurs = principal.length > 1;
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-carte bg-vert p-6 text-white">
        <p className="text-mini text-white/80">{plusieurs ? 'Vos réflexes principaux' : 'Votre réflexe principal'}</p>
        {principal.map((r) => (
          <div key={r} className="mt-3">
            <h2 className="font-titre text-[28px] leading-tight">{REFLEX_PROFILES[r].label}</h2>
            <p className="mt-1 text-corps text-white/90">{REFLEX_PROFILES[r].description}</p>
          </div>
        ))}
        <p className="mt-4 text-mini text-white/80">
          {plusieurs
            ? 'Ce sont les réflexes dans lesquels vous vous reconnaissez le plus d’après vos réponses, à égalité.'
            : 'C’est le réflexe dans lequel vous vous reconnaissez le plus d’après vos réponses.'}
        </p>
      </section>

      {secondaires.length > 0 && (
        <section className="rounded-carte bg-lilas p-5">
          <p className="text-mini text-encre/70">{secondaires.length > 1 ? 'Vos réflexes secondaires' : 'Votre réflexe secondaire'}</p>
          {secondaires.map((r) => (
            <div key={r} className="mt-2">
              <h3 className="font-titre text-carte">{REFLEX_PROFILES[r].label}</h3>
              <p className="mt-1 text-corps text-encre/85">{REFLEX_PROFILES[r].description}</p>
            </div>
          ))}
          <p className="mt-3 text-mini text-encre/70">
            {secondaires.length > 1
              ? 'Ce sont les réflexes qui ressortent ensuite de vos réponses, à égalité.'
              : 'C’est le deuxième réflexe qui ressort de vos réponses.'}
          </p>
        </section>
      )}

      {!compact && (
        <section className="rounded-carte bg-surface p-5">
          <p className="surtitre">Les 5 réflexes relationnels</p>
          <ul className="mt-3 flex flex-col gap-3">
            {REFLEX_TYPES.map((r) => (
              <li key={r} className="text-corps">
                <span className="text-vert">{REFLEX_PROFILES[r].label}</span> : {REFLEX_PROFILES[r].description}
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-mini text-encre/55">
        Ces résultats sont des pistes de travail, pas un diagnostic psychologique ou médical.
      </p>
    </div>
  );
}
