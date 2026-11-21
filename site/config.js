// Configuration du site Présence Authentique.
// URL de production de l'app (projet Vercel presence-authentique-app). En local : "http://localhost:5173".
// Les liens localhost ne fonctionnent que sur l'ordinateur où tourne l'app.
// La page Application est aussi affichée à l'adresse de l'app (réécriture Vercel du projet app) :
// les liens vers le site sont donc absolus quand la page est vue depuis l'app.
var PA_APP_URL = "https://presence-authentique-app.vercel.app";
var PA_SITE_URL = location.origin === PA_APP_URL ? "https://presence-authentique-site.vercel.app" : "";

window.PA_CONFIG = {
  APP_URL: PA_APP_URL,
  SITE_URL: PA_SITE_URL,
  // Vrai quand la page est affichée à l'adresse de l'app (seul cas où « Se connecter » apparaît).
  SUR_APP: location.origin === PA_APP_URL,

  // Pages des offres. La page Application vit à l'adresse de l'app.
  PAGES: {
    application: PA_APP_URL + "/",
    dojo: PA_SITE_URL + "/dojo/",
    coaching: PA_SITE_URL + "/sos-conversation-difficile/",
    immersions: PA_SITE_URL + "/immersions/",
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
  connexion: window.PA_CONFIG.APP_URL + "/connexion",
};
