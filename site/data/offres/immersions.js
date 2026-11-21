// Page Immersions. Texte : bloc « Immersion » du site actuel, mot pour mot.
// Pas encore d'inscription aux immersions : le bouton invite à s'inscrire à la newsletter
// pour être prévenu des prochaines dates (demande d'Ombeline du 21/11).
var IMMERSION_BOUTON = { label: "S’inscrire à la newsletter pour être informé des prochaines immersions", link: "newsletter" };

window.PA_OFFRE = {
  cle: "immersions",
  presentation: {
    titre: "Immersion", // titre à fournir : en attendant, le nom de l'offre
    texte: [
      { lead: true, html: "Vous souhaitez accélérer votre progression." },
      { html: "Quelques jours en petit groupe dans une nature privilégiée pour prendre du recul, pratiquer intensivement et intégrer de nouvelles façons d’être en relation." },
    ],
    dansQuelCas: "Vous voulez vous accorder quelques jours en petit groupe, dans la nature.",
    visuel: { type: "image", src: "/assets/offres/immersion-groupe.jpg", alt: "Petit groupe assis dans l’herbe devant une montagne enneigée", width: 800, height: 1000 },
    bouton: IMMERSION_BOUTON,
  },
  // Toute photo ajoutée plus tard dans Presence/immersion/ s'ajoute ici.
  galerie: [
    { src: "/assets/offres/immersion-bain-nordique.jpg", alt: "Bain nordique sur une terrasse, face à des montagnes enneigées", width: 480, height: 640 },
    { src: "/assets/offres/immersion-foret.jpg", alt: "Deux personnes qui marchent et parlent sur un chemin en forêt", width: 800, height: 1197 },
    { src: "/assets/offres/immersion-lac.jpg", alt: "Lac de montagne vu entre des pins", width: 800, height: 1067 },
  ],
  autorite: { elements: [], titreLogos: "" },
  temoignages: { bloc: "immersions", titre: "Ce que disent les personnes accompagnées par Agnès", couleurs: "sable,lilas" },
  temoignagesVideo: [],
  vente: {
    // Infos à fournir : lieu, dates, durée, taille du groupe, prix, ce qui est inclus.
    groupes: [{ infos: [], actions: IMMERSION_BOUTON ? [IMMERSION_BOUTON] : [] }],
  },
  etapes: [],
  faq: [],
  rappel: IMMERSION_BOUTON ? { bouton: IMMERSION_BOUTON } : null,
};
