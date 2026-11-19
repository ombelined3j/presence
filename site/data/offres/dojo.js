// Page Dojo. Texte : bloc « Dojo » du site actuel, mot pour mot.
// Liens : Linktree, à mettre à jour chaque mois.
// "date" (AAAA-MM-JJ) : l'intro gratuite disparaît après ce jour.
// "mois" (AAAA-MM) : le mois de Fondamentaux disparaît une fois ce mois terminé.
var DOJO_INTROS = [
  { date: "2026-11-26", label: "DOJO Relationnel intro gratuite jeudi 26 novembre, 13h-14h, heure de Paris", href: "https://us06web.zoom.us/meeting/register/HUUogLTsRdm65EQB-FG6HA" },
  { date: "2026-12-04", label: "DOJO Relationnel intro gratuite vendredi 04 décembre, 13h-14h, heure de Paris", href: "https://us06web.zoom.us/meeting/register/v8UZzHFqTtGVOnxBa33mfg" },
  { date: "2027-01-08", label: "DOJO Relationnel intro gratuite vendredi 08 janvier, 13h-14h, heure de Paris", href: "https://us06web.zoom.us/meeting/register/J2_HrzZvQPm4b0gT8AEAmw" },
];
var DOJO_FONDAMENTAUX = [
  { mois: "2026-11", label: "DOJO Relationnel Fondamentaux en Novembre 2026", href: "https://pay.brevo.com/c7839ba7-317d-4904-8bb1-e5692f29e22c" },
  { mois: "2026-12", label: "DOJO Relationnel Fondamentaux en Décembre 2026", href: "https://pay.brevo.com/63623612-5b34-4107-bc87-4bf61c983144" },
  { mois: "2027-01", label: "DOJO Relationnel Fondamentaux en Janvier 2027", href: "https://pay.brevo.com/1a51a137-de67-4ee5-8cfd-e51b843e1be1" },
];

// Prochaine intro gratuite, pour le bouton de la présentation et le rappel en fin de page.
var DOJO_PROCHAINE = (function () {
  var d = new Date();
  var t = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  return DOJO_INTROS.filter(function (i) { return i.date >= t; })[0] || null;
})();

window.PA_OFFRE = {
  cle: "dojo",
  presentation: {
    titre: "Dojo Relationnel", // titre à fournir : en attendant, le nom de l'offre
    texte: [
      { lead: true, html: "Vous souhaitez développer durablement vos compétences relationnelles." },
      { html: "Rejoignez le dojo:<br />un espace d’entraînement ludique et régulier pour pratiquer, expérimenter et progresser au fil de situations réelles." },
    ],
    dansQuelCas: "Vous voulez vous entraîner régulièrement avec d'autres personnes, sur des situations réelles.",
    visuel: { type: "image", src: "/assets/offres/dojo-echange.jpg", alt: "Agnès Candiotti en échange avec une participante, en intérieur", width: 800, height: 592},
    bouton: DOJO_PROCHAINE,
  },
  autorite: { elements: [], titreLogos: "" },
  temoignages: { bloc: "dojo", titre: "Ce que disent les personnes accompagnées par Agnès" },
  temoignagesVideo: [],
  vente: {
    groupes: [
      { titre: "Intro gratuite", infos: ["1 h", "En ligne, sur Zoom", "13h-14h, heure de Paris"], actions: DOJO_INTROS },
      { titre: "Fondamentaux", secondaire: true, infos: [], actions: DOJO_FONDAMENTAUX },
    ],
  },
  etapes: [
    { titre: "L'intro gratuite", texte: "1 h en ligne, pour découvrir le dojo." },
    { titre: "Les Fondamentaux", texte: "Le parcours, un départ par mois." },
  ],
  // Contenu repris du document « DOJO_Relationnel_FONDAMENTAUX » (Google Docs d'Agnès).
  // Adapté : tutoiement passé au vouvoiement, accords au féminin retirés (liste dans le compte rendu),
  // gras rendu en vert. Le lien de la salle Zoom du document n'est pas repris (il est privé).
  blocs: [
    {
      avant: true,
      type: "texte",
      titre: "Comprendre les réflexes relationnels",
      paragraphes: [
        "Une remarque qui dérange, un désaccord qui perdure ou même un regard insistant peuvent être perçus inconsciemment comme une menace. Notre organisme mobilise alors des réactions automatiques de protection. Cinq grandes tendances se dégagent :",
      ],
      cartes: [
        { titre: "Se retirer", texte: "Je prends de la distance, je me coupe de mes sensations ou je pars dans mes pensées afin de sortir de l’échange, mentalement ou physiquement." },
        { titre: "Endurer", texte: "Je prends sur moi, je retiens ce que j’aimerais dire et je résiste intérieurement en attendant que ça passe." },
        { titre: "Se suradapter", texte: "Je m’ajuste aux attentes de l’autre sans me prendre en compte." },
        { titre: "S’imposer", texte: "Je m’oppose ou je prends le dessus pour que mon point de vue l’emporte." },
        { titre: "Se conformer", texte: "Je cherche à appliquer les règles et bien faire “comme il faut”, respecter la façon “correcte” de me comporter." },
      ],
      question: "Est-ce que vous vous reconnaissez dans une ou plusieurs d'entre elles ?",
    },
    {
      avant: true,
      type: "texte",
      titre: "L’objectif du DOJO Relationnel",
      paragraphes: [
        "Quelle que soit votre réaction de protection, elle <span class=\"kw\">oriente votre attention fortement</span> vers votre monde intérieur ou vers l’extérieur. Or, une conversation fluide et constructive nécessite une <span class=\"kw\">circulation fluide de l’attention</span>, entre vous et l’autre.",
        "Les exercices que nous pratiquons au sein du DOJO Relationnel agissent directement sur <span class=\"kw\">la maîtrise de votre attention durant une interaction</span>. Ils développent ainsi votre capacité à garder votre centre et votre clarté, même dans les moments de déstabilisation. À l’image d’un entraînement physique comme l’Aïkido, l’<span class=\"kw\">entraînement verbal</span> révèle comment vous réagissez par défaut (votre réaction automatique) et vous offre la possibilité de tester d’autres types de réponses (vous gagnez en liberté et choix). Cet entraînement agit sur votre <span class=\"kw\">capacité de régulation interne</span>, la <span class=\"kw\">maîtrise de votre attention</span> et la flexibilité dans le <span class=\"kw\">choix de votre réponse</span>.",
      ],
    },
    {
      avant: true,
      type: "texte",
      titre: "Les bénéfices du DOJO Relationnel",
      paragraphes: [
        "Vous entraînez de <span class=\"kw\">nouveaux réflexes relationnels</span>. Répétition après répétition, vous observerez dans votre quotidien des effets sur votre capacité à <span class=\"kw\">oser dire</span> ce que vous pensez, à <span class=\"kw\">dire non sans culpabiliser</span>, à être <span class=\"kw\">moins sur la défensive</span>, à <span class=\"kw\">mieux négocier</span>…",
        "Vous observerez des bénéfices dans l’ensemble de votre vie relationnelle, qu’il s’agisse de situations liées à votre <span class=\"kw\">vie personnelle ou professionnelle</span>.",
      ],
      question: "Dans quelle situation concrète de votre quotidien pourriez-vous observer les changements liés à votre pratique ?",
    },
    {
      type: "texte",
      titre: "L’éthique au sein du DOJO Relationnel",
      paragraphes: [
        "Pour entraîner nos réflexes, les sessions d’entraînement sont volontairement rythmées et plus ou moins déstabilisantes. Chaque personne doit donc respecter les principes suivants :",
      ],
      liste: [
        "<span class=\"kw\">Restez dans la présence et l’engagement</span> (garder caméra et micro ouverts pour interagir)",
        "<span class=\"kw\">Choisissez la bienveillance envers vous-même</span> (je fais du mieux que je peux)",
        "<span class=\"kw\">Choisissez la bienveillance pour les autres</span> (à chaque personne ses objectifs et ses progrès)",
        "<span class=\"kw\">Osez échouer</span> (en ne prenant pas la pratique trop sérieusement)",
        "<span class=\"kw\">Faites une pause à tout moment</span> (signe du temps mort avec les mains)",
      ],
    },
    {
      type: "texte",
      titre: "En pratique",
      liste: [
        "Connectez-vous depuis un <span class=\"kw\">espace calme</span> où vous pouvez <span class=\"kw\">vous exprimer, à l’abri des interruptions</span>.",
        "Vérifiez que la <span class=\"kw\">qualité de votre connexion internet</span> est suffisamment bonne pour des interactions fluides (l’entraînement des réflexes en temps réel ne fonctionne pas en cas de temps de latence importants).",
        "Arrivez <span class=\"kw\">à l’heure</span> avec votre <span class=\"kw\">caméra</span> et votre <span class=\"kw\">micro</span> activés.",
      ],
    },
  ],
  faq: [],
  rappel: DOJO_PROCHAINE ? { bouton: DOJO_PROCHAINE } : null,
};
