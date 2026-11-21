// Page SOS conversation difficile (offre de coaching). Texte : bloc « SOS » du site actuel, mot pour mot.
// Libellé du bouton : repris du bouton « SOS conversation difficile » du site actuel (à valider).
var SOS_PAIEMENT = { label: "SOS conversation difficile", href: "https://pay.brevo.com/25277911-bea4-4e0d-8a79-52b70661543f" };

window.PA_OFFRE = {
  cle: "coaching",
  presentation: {
    surtitre: "Coaching",
    titre: "SOS conversation difficile",
    texte: [
      { lead: true, html: "Une conversation importante arrive dans les prochains jours." },
      { html: "Préparez-la avec un accompagnement ciblé pour gagner en clarté et en confiance." },
    ],
    dansQuelCas: "Une conversation difficile est prévue dans les prochains jours, ou le besoin est ponctuel ou urgent.",
    visuel: { type: "bulles" },
    // Affiché juste au-dessus du bouton (demande d'Ombeline du 21/11).
    mention: "Réservez et payez en ligne, puis contactez-moi à agnes@presenceauthentique.com pour définir le jour et l’heure de votre coaching.",
    bouton: SOS_PAIEMENT,
  },
  autorite: { elements: [], titreLogos: "" },
  // Bloc « coaching » : David-Michael Lozupone, Jeanne Guillaume et les 7 avis Superprof.
  temoignages: { bloc: "coaching", titre: "Ce que disent les personnes accompagnées par Agnès" },
  temoignagesVideo: [],
  vente: {
    // Infos à fournir, dans cet ordre : délai pour obtenir un rendez-vous, prix, durée, format.
    groupes: [{ infos: [], actions: [SOS_PAIEMENT] }],
  },
  etapes: [
    { texte: "Vous réservez et payez en ligne." },
    { texte: "Vous me contactez à agnes@presenceauthentique.com pour définir le jour et l’heure de votre coaching." },
  ],
  faq: [],
  rappel: { bouton: SOS_PAIEMENT },
};
