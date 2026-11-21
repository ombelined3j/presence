// Page Application. Textes repris du PDF de présentation de l'application.
// Changements demandés par Ombeline : pas de prix, pas de « En français »,
// « 10 questions, diagnostic gratuit. » au lieu de « 3 à 5 questions… ».
// Application centrée sur la vie professionnelle uniquement : aucune mention de situation personnelle.
window.PA_OFFRE = {
  cle: "application",
  presentation: {
    surtitre: "Application d'entraînement quotidien",
    titre: "Une séance de 5 minutes par jour, sur votre téléphone.",
    texte: [
      { html: "Savoir comment poser une limite, recadrer ou défendre une décision ne suffit pas toujours au moment où la conversation se tend. Ce qui fait la différence, c’est la pratique : 5 minutes par jour, sur votre téléphone, pour rester stable dans vos échanges professionnels et moins ressasser après coup." },
    ],
    pourQuiLabel: "Pourquoi chaque jour",
    pourQui: "Une formation ou un accompagnement vous donne des clés. Mais une compétence relationnelle se construit comme une compétence physique : <span class=\"kw\">par la répétition</span>. Sans pratique régulière, ce que l’on a compris reste théorique, et les anciens réflexes reviennent dès que la tension monte. L’application vous offre cette pratique, chaque jour, pour découvrir ces réflexes ou ancrer ce que vous avez déjà travaillé.",
    dansQuelCas: "Vos journées comptent des échanges à fort enjeu : un feedback à donner, une décision à défendre, une négociation à mener. Vous voulez vous entraîner chaque jour en autonomie, ou préparer une conversation précise.",
    visuel: { type: "telephone" },
    bouton: { label: "Découvrir mon réflexe face aux conversations difficiles", link: "diagnostic", note: "10 questions, diagnostic gratuit." },
    mention: "Lancement prévu début janvier 2027",
  },
  autorite: {
    extra: "Les séances sont conçues par Agnès.",
    elements: [], // certifications, années d'expérience, personnes accompagnées, formations, interventions
    titreLogos: "", // titre de la bande de logos, à fournir
  },
  temoignages: { bloc: "application", titre: "Ce que disent les personnes accompagnées par Agnès" },
  temoignagesVideo: [],
  vente: {
    groupes: [
      {
        infos: ["Diagnostic gratuit", "1 semaine offerte", "Web app, rien à télécharger", "France, Belgique, Suisse et Québec."],
        actions: [{ label: "Découvrir mon réflexe face aux conversations difficiles", link: "diagnostic", note: "10 questions, diagnostic gratuit." }],
      },
    ],
  },
  etapes: [
    { titre: "Un mini-diagnostic", texte: "10 questions sur vos réflexes face aux situations tendues : vous taire, trop vous adapter, réagir à chaud." },
    { titre: "Votre résultat", texte: "Vous découvrez votre réflexe principal. L'entraînement s'appuie dessus." },
    { titre: "Votre rappel", texte: "Vous choisissez l'heure de votre séance quotidienne." },
    { titre: "La pratique", texte: "Chaque jour, des micro-pratiques pour rester calme et stable dans les échanges tendus." },
  ],
  blocs: [
    {
      // Les deux sont inclus, on ne choisit pas : la séance du jour (ancrage) ET la préparation.
      type: "cartes",
      titre: "Dans l’app : la séance du jour, et la préparation en plus",
      groupes: [
        { items: [
          { titre: "Chaque jour : la séance du jour", texte: "5 minutes d’ancrage, au moment que vous choisissez, pour rester calme et stable quand une conversation se tend." },
          { titre: "Et en plus, quand vous en avez besoin", texte: "Une conversation difficile approche au travail ? Préparez-la en quelques minutes, en plus de votre séance du jour." },
        ] },
      ],
    },
    {
      type: "situations",
      titre: "Préparer une situation difficile",
      sousTitre: "7 types de situations, au travail.",
      items: [
        { titre: "Poser une limite", texte: "Je définis ce que j'accepte, refuse ou souhaite voir cesser.", exemples: ["Dire non à une demande insistante", "Répondre à une remarque déplacée", "Demander à quelqu'un de cesser un comportement qui me dérange"] },
        { titre: "Réparer le lien", texte: "Je reconnais mon impact et cherche à restaurer la relation.", exemples: ["Présenter des excuses après avoir blessé quelqu'un", "Reconnaître une erreur auprès d'un collègue", "Rétablir la confiance après avoir trahi une confidence"] },
        { titre: "Oser exprimer ce qui compte", texte: "Je partage quelque chose d'important, de personnel ou de vulnérable.", exemples: ["Exprimer une frustration gardée pour soi", "Demander de l'aide dans une période difficile"] },
        { titre: "Convaincre et négocier", texte: "Je cherche à obtenir l'adhésion ou un accord.", exemples: ["Demander une augmentation de salaire", "Convaincre un client d'acheter une prestation", "Négocier les conditions d'un contrat"] },
        { titre: "Confronter l'autre à la réalité", texte: "Je communique une réalité difficile à entendre ou à reconnaître.", exemples: ["Donner un feedback négatif à un collaborateur", "Recadrer un salarié qui ne respecte pas ses engagements"] },
        { titre: "Accueillir avec discernement", texte: "Je reçois quelque chose de difficile et choisis comment y répondre.", exemples: ["Recevoir une critique de son manager", "Accueillir la colère d'une personne mécontente"] },
        { titre: "Traverser les désaccords et décider ensemble", texte: "Nous explorons nos différences ou construisons une décision commune.", exemples: ["Choisir entre deux stratégies au sein d'une équipe"] },
      ],
      conclusion: { titre: "Vous choisissez la situation, la séance s'adapte.", texte: "Par défaut, l'app vous propose la séance du jour." },
    },
    {
      // Repris de la page d'accueil de l'app, avec les ajouts demandés (Oser dire, Moins ressasser).
      type: "cartes",
      titre: "Ce que vous y gagnez",
      sousTitre: "Rester stable, même quand ça se tend.",
      groupes: [
        { items: [
          { titre: "Rester stable", texte: "Garder votre calme quand une conversation se tend." },
          { titre: "Oser dire", texte: "Poser vos limites et exprimer vos besoins sans culpabiliser, sans vous excuser ni vous justifier, et sans avoir peur de la réaction de l’autre." },
          { titre: "Moins ressasser", texte: "Moins rejouer la scène après coup, sans ruminer, et moins vous critiquer." },
          { titre: "Gagner en performance", texte: "Mieux négocier, mieux vivre vos relations professionnelles au quotidien et gagner en performance dans votre vie professionnelle." },
        ] },
      ],
    },
    {
      type: "cartes",
      titre: "Dans la durée",
      groupes: [
        { items: [
          { titre: "Votre historique", texte: "Les séances complétées, pour suivre votre entraînement." },
          { titre: "Votre profil", texte: "Le résultat de votre diagnostic, toujours accessible." },
        ] },
        { titre: "En option", items: [
          { titre: "Les dojos en live", texte: "Pour pratiquer en collectif.", page: "dojo" },
          { titre: "Une séance SOS", texte: "Si la situation est lourde, réservez directement avec Agnès.", page: "coaching" },
        ] },
      ],
    },
  ],
  faq: [], // { question, reponse }
  rappel: { bouton: { label: "Découvrir mon réflexe face aux conversations difficiles", link: "diagnostic", note: "10 questions, diagnostic gratuit." } },
};
