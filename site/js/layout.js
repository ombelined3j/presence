// En-tête, pied de page et barre fixe mobile, communs à toutes les pages.
// La page en cours est indiquée par <body data-page-actif="application|dojo|immersions|coaching">.
(function () {
  var ARROW = '<svg class="arrow" aria-hidden="true" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg>';
  var actif = document.body.getAttribute("data-page-actif") || "";

  // Ordre du menu : Application, Dojo, SOS conversation difficile, Immersions, Newsletter.
  var ONGLETS = [
    { page: "application", label: "Application" },
    { page: "dojo", label: "Dojo Relationnel" },
    { page: "coaching", label: "SOS conversation difficile" },
    { page: "immersions", label: "Immersions" },
    { link: "newsletter", label: "Newsletter" },
  ];

  function lien(o) {
    if (o.link) return '<a data-link="' + o.link + '" href="#" target="_blank" rel="noopener">' + o.label + "</a>";
    var current = o.page === actif ? ' class="is-active" aria-current="page"' : "";
    return '<a data-page="' + o.page + '" href="/"' + current + ">" + o.label + "</a>";
  }

  var header =
    '<a class="skip" href="#contenu">Aller au contenu</a>' +
    '<header class="header"><div class="header__inner wrap">' +
    '<a class="brand" href="/">Présence Authentique</a>' +
    '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">' +
    '<span class="menu-toggle__bars" aria-hidden="true"></span><span class="visually-hidden">Ouvrir le menu</span></button>' +
    '<nav class="nav" id="menu" aria-label="Navigation principale"><ul class="nav__list">' +
    ONGLETS.map(function (o) { return "<li>" + lien(o) + "</li>"; }).join("") +
    "</ul>" +
    '<a class="nav__login" data-link="connexion" href="#">Se connecter</a>' +
    '<a class="btn btn--small" data-link="diagnostic" href="#">Diagnostic gratuit ' + ARROW + "</a>" +
    "</nav></div></header>";

  var footer =
    '<footer class="footer"><div class="wrap footer__grid">' +
    '<div><p class="footer__brand">Présence Authentique</p>' +
    '<a class="btn" data-link="newsletter" href="#" target="_blank" rel="noopener">S\'inscrire à la liste de diffusion ' + ARROW + "</a></div>" +
    '<div><p class="footer__label">Localisation</p><p>75019 Paris<br />05000 Gap</p>' +
    '<p class="footer__label">Contact</p>' +
    '<p><a href="mailto:agnes@presenceauthentique.com?subject=Contact">agnes@presenceauthentique.com</a><br /><a href="tel:+33688599079">06 88 59 90 79</a></p></div>' +
    '<nav aria-label="Navigation du pied de page"><ul class="footer__nav">' +
    ONGLETS.map(function (o) { return "<li>" + lien(o) + "</li>"; }).join("") +
    '<li><a data-link="diagnostic" href="#">Diagnostic gratuit</a></li>' +
    '<li><a data-link="connexion" href="#">Se connecter</a></li>' +
    "</ul></nav>" +
    "</div></footer>" +
    '<div class="mobile-bar"><a class="btn btn--block" data-link="diagnostic" href="#">Découvrir mon réflexe face aux conversations difficiles ' + ARROW + "</a></div>";

  var h = document.getElementById("layout-header");
  var f = document.getElementById("layout-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
