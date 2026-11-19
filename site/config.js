// Configuration du site Présence Authentique.
// Avant la mise en ligne : remplacer APP_URL par l'URL de production de l'app.
// Les liens localhost ne fonctionnent que sur l'ordinateur où tourne l'app.
window.PA_CONFIG = {
  APP_URL: "http://localhost:5173",

  // Pages des offres.
  PAGES: {
    application: "/application/",
    dojo: "/dojo/",
    coaching: "/sos-conversation-difficile/",
    immersions: "/immersions/",
  },

  NEWSLETTER_URL:
    "https://d3454476.sibforms.com/serve/MUIFAIeruYR-NBjYprqFA1VJgiY4VuCsaMaKtIrY-6RwCr7HTwvZOB56HEfeU5aJbYDHeUNLcuJLn_6UsTvJOr0FgE1719Kn2RBhnmjK2Kj3IeDG0OUVsRRE6R8HHHKmVjjj65wK-WNTHJpyfqpGf31hYOLNwnSUwBIORB1FVGMHqs9Ac7J6QhR5gFRGaUS-53r9eP9JXvyuoa32",

  LINKEDIN_EMBED:
    "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7491749863060242433?collapsed=1",

  // Reel Instagram de @presenceauthentique, intégré sans le script embed.js d'Instagram.
  INSTAGRAM_EMBED: "https://www.instagram.com/reel/DaSZ3PjE8gs/embed/captioned/",
};

window.PA_CONFIG.LINKS = {
  app: window.PA_CONFIG.APP_URL + "/",
  diagnostic: window.PA_CONFIG.APP_URL + "/diagnostic",
};
