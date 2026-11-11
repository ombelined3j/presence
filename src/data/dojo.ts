import type { DojoContent, Difficulty } from '../types';

// Source unique des scénarios initiaux du Dojo. Sert de seed pour la table exercises.
// Pour ajouter un exercice : insérer une ligne dans `exercises` avec un `content`
// respectant le type DojoContent (context, goal, steps[], reflection[]).

export interface DojoSeed {
  title: string;
  description: string;
  category: string;
  estimated_duration: number;
  difficulty_level: Difficulty;
  content: DojoContent;
}

export const DOJO_SEED: DojoSeed[] = [
  {
    title: 'Dire non à une demande de dernière minute',
    description: 'Refuser sans se justifier pendant dix minutes, et sans fermer la porte.',
    category: 'Travail',
    estimated_duration: 4,
    difficulty_level: 'debutant',
    content: {
      context: 'Il est 17 h 30. Une personne de votre équipe vous demande de reprendre un dossier urgent pour demain matin. Votre soirée est déjà prise.',
      goal: 'Dire non clairement, tout en restant dans la relation.',
      steps: [
        {
          other_says: '« Tu pourrais regarder ça ce soir ? C’est vraiment urgent, je n’ai personne d’autre. »',
          prompt: 'Que répondez-vous ?',
          options: [
            { label: '« Euh… oui, bon, je vais essayer de trouver du temps. »', tone: 'a_explorer', feedback: 'Un oui contraint laisse souvent un goût amer et ne règle pas la question. Qu’est-ce qui vous empêcherait de dire non ici ?' },
            { label: '« Je comprends que ce soit urgent. Ce soir, je ne suis pas disponible. Je peux y regarder demain à 9 h. »', tone: 'ajuste', feedback: 'Vous reconnaissez la contrainte de l’autre, posez votre limite et proposez une alternative réaliste. C’est clair et respectueux.' },
            { label: '« Encore ? C’est toujours à moi qu’on demande ça. »', tone: 'a_explorer', feedback: 'La frustration est légitime, mais le reproche risque de déplacer la conversation. Votre limite reste à formuler.' },
          ],
        },
        {
          other_says: '« Demain, ce sera trop tard. Tu ne peux vraiment pas faire un effort ? »',
          prompt: 'La pression monte. Que dites-vous ?',
          options: [
            { label: '« Je comprends. Ma réponse reste la même pour ce soir. Veux-tu qu’on voie ensemble qui d’autre pourrait aider ? »', tone: 'ajuste', feedback: 'Vous tenez votre limite sans la rejustifier, et vous restez coopératif ou coopérative sur le problème.' },
            { label: '« J’ai un rendez-vous important, et puis j’ai déjà beaucoup travaillé cette semaine, et… »', tone: 'a_explorer', feedback: 'Multiplier les justifications ouvre la négociation. Une limite n’a pas besoin d’être prouvée pour être valable.' },
            { label: '« Bon, d’accord. »', tone: 'a_explorer', feedback: 'Céder à la deuxième relance est très courant. Qu’auriez-vous besoin de vous dire pour tenir votre position ?' },
          ],
        },
      ],
      reflection: [
        'Qu’avez-vous ressenti au moment de dire non ?',
        'Quelle phrase aimeriez-vous garder pour une prochaine fois ?',
      ],
    },
  },
  {
    title: 'Recevoir une critique en réunion',
    description: 'Accueillir un retour difficile sans se justifier aussitôt.',
    category: 'Travail',
    estimated_duration: 5,
    difficulty_level: 'intermediaire',
    content: {
      context: 'En réunion, devant l’équipe, quelqu’un remet en cause la qualité de votre présentation.',
      goal: 'Écouter, clarifier, puis répondre avec calme.',
      steps: [
        {
          other_says: '« Honnêtement, les chiffres présentés ne sont pas fiables. On ne peut pas décider sur cette base. »',
          prompt: 'Votre première réaction ?',
          options: [
            { label: '« Ils sont parfaitement fiables, j’ai passé deux jours dessus. »', tone: 'a_explorer', feedback: 'La défense immédiate est naturelle, mais elle ferme l’échange avant d’avoir compris l’objection.' },
            { label: '« Qu’est-ce qui te fait douter précisément ? »', tone: 'ajuste', feedback: 'Une question de clarification vous donne du temps et ramène la discussion sur des faits.' },
            { label: 'Vous ne dites rien et passez à la diapositive suivante.', tone: 'a_explorer', feedback: 'Se retirer évite la tension sur le moment, mais la question reste en suspens pour tout le monde.' },
          ],
        },
        {
          other_says: '« Les données de mars ne correspondent pas à ce qu’on a vu en comité. »',
          prompt: 'Vous avez maintenant une objection précise. Que dites-vous ?',
          options: [
            { label: '« C’est possible, je vérifie et je reviens vers vous demain avec la version corrigée si besoin. »', tone: 'ajuste', feedback: 'Vous reconnaissez le point sans vous dévaloriser, et vous proposez une suite concrète.' },
            { label: '« Désolé, je suis vraiment nul avec les chiffres. »', tone: 'a_explorer', feedback: 'Une erreur possible ne dit rien de votre valeur. Séparer le travail de la personne aide à rester stable.' },
            { label: '« Tout le monde fait des erreurs, ce n’est pas le sujet. »', tone: 'a_explorer', feedback: 'Minimiser peut donner l’impression de ne pas prendre l’objection au sérieux.' },
          ],
        },
      ],
      reflection: [
        'Où avez-vous senti la critique dans votre corps ?',
        'Qu’est-ce qui vous aide à distinguer une critique de votre travail d’une critique de vous ?',
      ],
    },
  },
  {
    title: 'Poser une limite avec un proche',
    description: 'Exprimer une limite à quelqu’un que l’on aime, sans culpabiliser.',
    category: 'Famille',
    estimated_duration: 4,
    difficulty_level: 'debutant',
    content: {
      context: 'Un parent passe régulièrement chez vous sans prévenir. Vous aimeriez être prévenu ou prévenue avant.',
      goal: 'Formuler la limite simplement, en parlant de vous.',
      steps: [
        {
          other_says: '« Coucou ! J’étais dans le quartier, je suis passé te voir. »',
          prompt: 'Comment abordez-vous le sujet ?',
          options: [
            { label: '« Ça me fait plaisir de te voir. J’aimerais qu’on en parle : je préfère que tu me préviennes avant de passer. »', tone: 'ajuste', feedback: 'Vous commencez par le lien, puis vous exprimez votre préférence en « je ». C’est direct et chaleureux.' },
            { label: '« Tu pourrais quand même prévenir, c’est pénible à la fin. »', tone: 'a_explorer', feedback: 'Le fond est juste, mais la forme en reproche risque de provoquer une défense.' },
            { label: 'Vous souriez, et vous n’en parlez pas, encore une fois.', tone: 'a_explorer', feedback: 'Se taire préserve le moment, mais la gêne risque de revenir à chaque visite.' },
          ],
        },
        {
          other_says: '« Ah bon ? Je ne savais pas que je dérangeais… »',
          prompt: 'La personne semble blessée. Que répondez-vous ?',
          options: [
            { label: '« Tu ne déranges pas, je tiens à toi. C’est juste que j’ai besoin de savoir à l’avance pour être disponible. »', tone: 'ajuste', feedback: 'Vous rassurez sur la relation sans retirer votre besoin. Les deux peuvent coexister.' },
            { label: '« Non, non, laisse tomber, ce n’est rien. »', tone: 'a_explorer', feedback: 'Retirer la demande face à la peine de l’autre est fréquent. Votre besoin reste pourtant valable.' },
            { label: '« Si, un peu, honnêtement. »', tone: 'a_explorer', feedback: 'C’est sincère, mais sans explication cela peut être reçu comme un rejet.' },
          ],
        },
      ],
      reflection: [
        'Qu’est-ce qui rend une limite difficile à poser avec cette personne ?',
        'Comment pourriez-vous vous rappeler que poser une limite protège aussi la relation ?',
      ],
    },
  },
  {
    title: 'Exprimer un besoin dans le couple',
    description: 'Parler de ce qui vous manque sans que cela devienne un reproche.',
    category: 'Couple',
    estimated_duration: 5,
    difficulty_level: 'intermediaire',
    content: {
      context: 'Depuis quelques semaines, vous avez le sentiment de passer peu de temps de qualité ensemble.',
      goal: 'Exprimer un besoin et ouvrir la discussion.',
      steps: [
        {
          other_says: '« Quelque chose te préoccupe en ce moment ? »',
          prompt: 'C’est l’occasion. Que dites-vous ?',
          options: [
            { label: '« Tu n’es jamais là pour moi, tu passes ta vie sur ton téléphone. »', tone: 'a_explorer', feedback: 'Les mots « jamais » et « toujours » sont souvent reçus comme des attaques. Le besoin derrière reste à dire.' },
            { label: '« Oui. Ces dernières semaines, j’ai l’impression qu’on se voit peu vraiment. Ça me manque. »', tone: 'ajuste', feedback: 'Vous décrivez une situation, ce que vous ressentez, et vous restez dans le « je ». C’est une ouverture.' },
            { label: '« Non, rien, c’est juste la fatigue. »', tone: 'a_explorer', feedback: 'L’autre vous tend une perche. Qu’est-ce qui rend difficile de la saisir ?' },
          ],
        },
        {
          other_says: '« Je suis débordé en ce moment, tu le sais bien. »',
          prompt: 'L’autre se justifie. Comment poursuivez-vous ?',
          options: [
            { label: '« Je sais. Je ne te reproche rien. Est-ce qu’on pourrait garder une soirée par semaine rien que pour nous ? »', tone: 'ajuste', feedback: 'Vous reconnaissez sa réalité, vous retirez la charge de reproche et vous faites une demande concrète.' },
            { label: '« Tu es toujours débordé, c’est une excuse. »', tone: 'a_explorer', feedback: 'La conversation risque de devenir un débat sur qui a raison, plutôt que sur ce dont vous avez besoin.' },
            { label: '« Bon, tant pis, on verra plus tard. »', tone: 'a_explorer', feedback: 'Repousser est tentant, mais votre besoin n’a pas encore été entendu.' },
          ],
        },
      ],
      reflection: [
        'Quel est le besoin le plus important pour vous dans cette situation ?',
        'Quelle demande concrète pourriez-vous faire cette semaine ?',
      ],
    },
  },
  {
    title: 'Revenir sur une dispute avec un ami',
    description: 'Reprendre une conversation qui s’est mal terminée.',
    category: 'Amitié',
    estimated_duration: 6,
    difficulty_level: 'avance',
    content: {
      context: 'La semaine dernière, une discussion avec un ami proche a dégénéré. Depuis, vous ne vous êtes pas reparlé.',
      goal: 'Rouvrir le dialogue, reconnaître sa part, écouter l’autre.',
      steps: [
        {
          other_says: '« Salut. Tu voulais qu’on se parle ? »',
          prompt: 'Comment ouvrez-vous ?',
          options: [
            { label: '« Oui. Notre dernière discussion me reste en tête. J’aimerais comprendre comment tu l’as vécue, et te dire comment moi je l’ai vécue. »', tone: 'ajuste', feedback: 'Vous posez le cadre d’un échange dans les deux sens, sans désigner de coupable.' },
            { label: '« Je voulais que tu t’excuses pour ce que tu as dit. »', tone: 'a_explorer', feedback: 'Commencer par une exigence met l’autre en position de défense dès la première phrase.' },
            { label: '« Oublions, ce n’était pas grave. »', tone: 'a_explorer', feedback: 'Si ce n’était pas grave, vous ne seriez peut-être pas là. Qu’est-ce qui mérite d’être dit ?' },
          ],
        },
        {
          other_says: '« Franchement, j’ai trouvé que tu m’avais parlé de haut. »',
          prompt: 'Ce n’est pas comme ça que vous l’avez vécu. Que dites-vous ?',
          options: [
            { label: '« Ce n’était pas mon intention, mais j’entends que tu l’as reçu comme ça. Qu’est-ce qui t’a fait cet effet ? »', tone: 'ajuste', feedback: 'Vous distinguez votre intention de l’effet produit, et vous continuez à écouter. C’est souvent ce qui débloque.' },
            { label: '« Pas du tout, c’est toi qui t’es emporté. »', tone: 'a_explorer', feedback: 'Corriger la perception de l’autre relance souvent la dispute initiale.' },
            { label: '« D’accord, c’est entièrement ma faute. »', tone: 'a_explorer', feedback: 'Prendre toute la responsabilité apaise un temps, mais votre version reste non dite.' },
          ],
        },
      ],
      reflection: [
        'Qu’avez-vous appris sur la façon dont l’autre a vécu la situation ?',
        'Quelle part de responsabilité êtes-vous prêt ou prête à reconnaître ?',
      ],
    },
  },
  {
    title: 'Demander une augmentation',
    description: 'Formuler une demande importante et tenir face à un premier refus.',
    category: 'Travail',
    estimated_duration: 6,
    difficulty_level: 'avance',
    content: {
      context: 'Vous avez obtenu un rendez-vous avec votre responsable pour parler de votre rémunération.',
      goal: 'Faire une demande claire, l’étayer, et rester stable face à l’objection.',
      steps: [
        {
          other_says: '« Je t’écoute, de quoi voulais-tu parler ? »',
          prompt: 'Comment formulez-vous votre demande ?',
          options: [
            { label: '« Je sais que ce n’est sûrement pas le moment, mais si jamais c’était possible… »', tone: 'a_explorer', feedback: 'Les précautions affaiblissent la demande avant même qu’elle soit posée.' },
            { label: '« Je souhaite parler de ma rémunération. Sur l’année, j’ai pris en charge X et Y. Je demande une augmentation de Z. »', tone: 'ajuste', feedback: 'Demande explicite, faits concrets, chiffre précis : votre interlocuteur sait exactement de quoi on parle.' },
            { label: '« Si je n’ai pas d’augmentation, je vais devoir regarder ailleurs. »', tone: 'a_explorer', feedback: 'Un ultimatum en ouverture installe un rapport de force difficile à défaire.' },
          ],
        },
        {
          other_says: '« Le budget est serré cette année, je ne peux rien promettre. »',
          prompt: 'Premier refus. Que répondez-vous ?',
          options: [
            { label: '« D’accord, tant pis. »', tone: 'a_explorer', feedback: 'Renoncer au premier obstacle est fréquent. Il existe souvent un espace de discussion.' },
            { label: '« J’entends la contrainte. Qu’est-ce qui serait possible, et à quelle échéance pourrait-on en reparler ? »', tone: 'ajuste', feedback: 'Vous respectez la contrainte, tout en gardant la conversation ouverte et en cherchant une suite datée.' },
            { label: '« Le budget est toujours serré quand il s’agit de moi. »', tone: 'a_explorer', feedback: 'Le sentiment d’injustice est compréhensible, mais il risque de faire dévier l’échange.' },
          ],
        },
      ],
      reflection: [
        'Qu’est-ce qui vous a semblé le plus difficile à dire ?',
        'De quels faits concrets aimeriez-vous disposer pour une vraie demande ?',
      ],
    },
  },
];
