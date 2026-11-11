import type { ReflexType } from '../types';

export interface ReflexProfile {
  label: string;
  short: string;
  description: string;
  strength: string;
  axes: string[];
  firstExercise: { title: string; text: string; audioKey: string };
}

// Ces profils sont des pistes de travail, pas des diagnostics psychologiques ou médicaux.
export const REFLEX_PROFILES: Record<ReflexType, ReflexProfile> = {
  avoidance: {
    label: 'Évitement',
    short: 'Vous repoussez les conversations difficiles.',
    description:
      'Quand une conversation s’annonce tendue, votre premier mouvement est de la remettre à plus tard. C’est une façon de vous protéger, et de préserver la relation. Le revers : le sujet reste là, et prend souvent plus de place qu’il n’en aurait pris.',
    strength: 'Vous savez ne pas envenimer une situation et choisir vos moments.',
    axes: [
      'Repérer le moment où vous commencez à repousser.',
      'Oser une première phrase courte, même imparfaite.',
      'Choisir un moment pour la conversation plutôt que l’attendre.',
    ],
    firstExercise: {
      title: 'Une première phrase',
      text: 'Pensez à une conversation que vous repoussez. Écrivez seulement la première phrase que vous pourriez dire. Rien de plus.',
      audioKey: 'respi',
    },
  },
  accommodation: {
    label: 'Adaptation',
    short: 'Vous privilégiez les besoins des autres.',
    description:
      'Vous êtes attentif ou attentive à l’autre, à ce qu’il ressent, à ce qu’il attend. Cette écoute est précieuse. Mais à force de vous ajuster, vos propres besoins passent souvent au second plan, et peuvent finir par peser.',
    strength: 'Vous percevez finement ce que vivent les autres.',
    axes: [
      'Identifier ce dont vous avez besoin, avant la conversation.',
      'Dire « non » ou « pas maintenant » sans vous justifier longuement.',
      'Remarquer quand vous cédez pour apaiser plutôt que par accord.',
    ],
    firstExercise: {
      title: 'Mon besoin en une phrase',
      text: 'Dans une situation récente où vous avez cédé, qu’est-ce que vous auriez eu besoin de dire ? Formulez-le en commençant par « J’ai besoin de… ».',
      audioKey: 'scan',
    },
  },
  defense: {
    label: 'Défense',
    short: 'Vous réagissez vite, vous vous justifiez.',
    description:
      'Face à une critique ou un désaccord, vous répondez rapidement, souvent en argumentant. Cela montre votre engagement et votre sens de la justice. Mais la vitesse peut couper l’écoute, et faire monter la tension des deux côtés.',
    strength: 'Vous défendez ce qui compte pour vous, avec énergie.',
    axes: [
      'Laisser un temps de respiration avant de répondre.',
      'Reformuler ce que l’autre a dit avant d’argumenter.',
      'Distinguer une critique de votre travail d’une critique de vous.',
    ],
    firstExercise: {
      title: 'Le temps d’un souffle',
      text: 'Lors de votre prochain échange tendu, laissez passer une respiration complète avant de répondre. Observez simplement ce que cela change.',
      audioKey: 'respi',
    },
  },
  control: {
    label: 'Contrôle',
    short: 'Vous voulez maîtriser la conversation.',
    description:
      'Vous aimez savoir où va une conversation et vous la structurez volontiers. C’est rassurant et souvent efficace. Mais quand tout est prévu, il reste peu de place pour ce que l’autre apporte, et les imprévus déstabilisent davantage.',
    strength: 'Vous apportez de la clarté et de la structure.',
    axes: [
      'Poser une vraie question ouverte, sans connaître la réponse.',
      'Laisser l’autre finir ses phrases.',
      'Accepter qu’une conversation ne se termine pas comme prévu.',
    ],
    firstExercise: {
      title: 'Une question ouverte',
      text: 'Préparez une question que vous pourriez poser à quelqu’un, dont vous ne connaissez pas la réponse. Par exemple : « Comment tu vois les choses, toi ? »',
      audioKey: 'sonore',
    },
  },
  withdrawal: {
    label: 'Retrait',
    short: 'Vous vous fermez, les mots ne viennent plus.',
    description:
      'Quand la tension monte, vous vous retirez à l’intérieur : les mots se bloquent, vous attendez que ça passe. C’est une réaction de protection fréquente. Ce que vous pensez reste alors non dit, et revient souvent après coup.',
    strength: 'Vous prenez le temps de réfléchir avant de parler.',
    axes: [
      'Revenir au corps quand vous sentez que vous vous fermez.',
      'Préparer une phrase « joker » pour demander du temps.',
      'Revenir sur une conversation plus tard, quand vous êtes prêt ou prête.',
    ],
    firstExercise: {
      title: 'Ma phrase joker',
      text: 'Préparez une phrase à dire quand les mots ne viennent plus. Par exemple : « J’ai besoin d’un moment pour y réfléchir, on peut en reparler ? »',
      audioKey: 'tactile',
    },
  },
};
