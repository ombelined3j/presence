// Moteur de préparation d'une situation difficile.
//
// Aujourd'hui : règles locales, déterministes, sans IA.
// Plus tard : une implémentation `PreparationProvider` peut appeler un modèle d'IA
// via une Edge Function Supabase (la clé du modèle reste côté serveur, jamais dans le frontend).
// Il suffira de remplacer `activeProvider`.

export interface PreparationInput {
  description: string;
  personInvolved?: string;
  mainConcern?: string;
  emotion?: string;
}

export interface PreparationStep {
  key: 'feeling' | 'message' | 'need' | 'words' | 'reactions' | 'listening';
  title: string;
  question: string;
  hint: string;
  placeholder: string;
}

export interface PreparationPlan {
  exerciseTitle: string;
  exerciseIntro: string;
  anchorAudioKey: string;
  steps: PreparationStep[];
}

export interface PreparationProvider {
  buildPlan(input: PreparationInput): Promise<PreparationPlan>;
}

export const CONCERNS = [
  { id: 'reaction', label: 'Sa réaction' },
  { id: 'words', label: 'Ne pas trouver mes mots' },
  { id: 'escalation', label: 'Que ça dégénère' },
  { id: 'unheard', label: 'Qu’on ne m’écoute pas' },
  { id: 'relationship', label: 'Abîmer la relation' },
  { id: 'giving_in', label: 'Céder une fois de plus' },
] as const;

export const EMOTIONS = ['Inquiétude', 'Peur', 'Colère', 'Agacement', 'Tristesse', 'Confusion', 'Fatigue', 'Culpabilité'] as const;

const EXERCISES: Record<string, { title: string; intro: string; audio: string }> = {
  reaction: {
    title: 'Anticiper sans scénariser',
    intro: 'Vous ne pouvez pas contrôler la réaction de l’autre. Vous pouvez préparer la vôtre. On va surtout travailler ce que vous voulez dire, et comment rester stable si l’autre réagit fort.',
    audio: 'respi',
  },
  words: {
    title: 'Préparer ses premiers mots',
    intro: 'Les premières phrases sont souvent les plus difficiles. On va les écrire ensemble, simplement, et préparer une phrase de secours pour le moment où les mots ne viennent plus.',
    audio: 'tactile',
  },
  escalation: {
    title: 'Garder la température basse',
    intro: 'Pour éviter que l’échange s’emballe, on va clarifier votre message principal, et préparer une façon de faire une pause si la tension monte.',
    audio: 'respi',
  },
  unheard: {
    title: 'Se faire entendre clairement',
    intro: 'Être entendu commence par savoir précisément ce que l’on veut dire. On va formuler votre besoin en une phrase, et la manière de vérifier qu’il a été compris.',
    audio: 'sonore',
  },
  relationship: {
    title: 'Parler vrai, préserver le lien',
    intro: 'Dire les choses n’abîme pas forcément une relation, souvent c’est le non-dit qui le fait. On va préparer une conversation qui reconnaît le lien autant que le désaccord.',
    audio: 'scan',
  },
  giving_in: {
    title: 'Tenir sa position avec douceur',
    intro: 'On va identifier votre besoin, préparer une phrase claire, et anticiper le moment où vous pourriez avoir envie de céder.',
    audio: 'scan',
  },
};

function buildSteps(input: PreparationInput): PreparationStep[] {
  const who = input.personInvolved?.trim() || 'l’autre personne';
  return [
    {
      key: 'feeling',
      title: 'Ce que je ressens',
      question: 'Quand vous pensez à cette conversation, que se passe-t-il en vous ?',
      hint: input.emotion
        ? `Vous avez nommé : ${input.emotion.toLowerCase()}. Où le sentez-vous dans le corps ? Qu’est-ce qui le déclenche ?`
        : 'Nommez une émotion, et l’endroit où vous la sentez dans le corps.',
      placeholder: 'Je ressens…',
    },
    {
      key: 'message',
      title: 'Ce que je veux exprimer',
      question: 'Si vous ne pouviez dire qu’une seule chose, laquelle ?',
      hint: 'Une phrase suffit. Le reste pourra venir ensuite.',
      placeholder: 'Ce que je veux dire, c’est…',
    },
    {
      key: 'need',
      title: 'Mon besoin',
      question: 'De quoi avez-vous besoin dans cette situation ?',
      hint: 'Un besoin parle de vous, pas de ce que l’autre devrait faire. Par exemple : du respect, du temps, de la clarté, de la reconnaissance.',
      placeholder: 'J’ai besoin de…',
    },
    {
      key: 'words',
      title: 'Mes mots',
      question: `Comment pourriez-vous ouvrir la conversation avec ${who} ?`,
      hint: 'Une structure simple peut aider : ce qui s’est passé (les faits), ce que vous ressentez, ce dont vous avez besoin, ce que vous demandez.',
      placeholder: 'Quand…, je me sens…, j’ai besoin de…, est-ce que tu serais d’accord pour… ?',
    },
    {
      key: 'reactions',
      title: 'Les réactions possibles',
      question: `Comment ${who} pourrait réagir ? Et que pourriez-vous répondre ?`,
      hint:
        input.mainConcern === 'words' || input.mainConcern === 'escalation'
          ? 'Préparez aussi une phrase pour faire une pause : « J’ai besoin d’un moment, on peut reprendre dans dix minutes ? »'
          : 'Pensez à la réaction que vous redoutez le plus, et à une réponse calme que vous pourriez donner.',
      placeholder: 'Si… alors je pourrais dire…',
    },
    {
      key: 'listening',
      title: 'Écouter l’autre',
      question: 'Quelle question pourriez-vous poser pour comprendre son point de vue ?',
      hint: 'Une vraie question ouverte, dont vous ne connaissez pas la réponse. Par exemple : « Comment tu vois les choses, toi ? »',
      placeholder: 'Je pourrais lui demander…',
    },
  ];
}

class LocalPreparationProvider implements PreparationProvider {
  async buildPlan(input: PreparationInput): Promise<PreparationPlan> {
    const ex = EXERCISES[input.mainConcern ?? ''] ?? {
      title: 'Préparer la conversation',
      intro: 'On va clarifier ce que vous ressentez, ce que vous voulez dire et comment accueillir la réponse de l’autre.',
      audio: 'respi',
    };
    return { exerciseTitle: ex.title, exerciseIntro: ex.intro, anchorAudioKey: ex.audio, steps: buildSteps(input) };
  }
}

export const activeProvider: PreparationProvider = new LocalPreparationProvider();
