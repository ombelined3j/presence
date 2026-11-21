import type { ReflexType } from '../types';

export interface ReflexProfile {
  label: string;
  description: string;
}

// « Les 5 réflexes relationnels », mot pour mot depuis la page Notion « Contenu de l’app ».
// Ces profils sont des pistes de travail, pas des diagnostics psychologiques ou médicaux.
export const REFLEX_PROFILES: Record<ReflexType, ReflexProfile> = {
  withdraw: { label: 'Me retirer', description: 'Je sors de l’échange, physiquement ou mentalement.' },
  endure: { label: 'Endurer', description: 'Je retiens ce que j’aimerais dire et j’attends que ça passe.' },
  overadapt: { label: 'Me suradapter', description: 'Je m’ajuste aux attentes de l’autre en faisant passer mes besoins au second plan.' },
  impose: { label: 'M’imposer', description: 'Je fais pression sur l’autre pour que mon point de vue l’emporte.' },
  conform: { label: 'Me conformer', description: 'Je me rassure en cherchant la règle à suivre ou la façon correcte de répondre.' },
};
