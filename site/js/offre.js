// Gabarit unique des pages d'offres. Le contenu vient de window.PA_OFFRE
// (un fichier par page dans data/offres/). Une partie sans contenu n'est pas affichée.
(function () {
  // Vrai quand la page est vue depuis l'adresse de l'app (page d'atterrissage sans autres liens).
  var SUR_APP = Boolean(window.PA_CONFIG && window.PA_CONFIG.SUR_APP);
  var O = window.PA_OFFRE;
  var main = document.getElementById("contenu");
  if (!O || !main) return;

  var ARROW = '<svg class="arrow" aria-hidden="true" viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg>';

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Aujourd'hui, en AAAA-MM-JJ (heure locale du visiteur).
  var now = new Date();
  var today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  var thisMonth = today.slice(0, 7);
  // Une intro gratuite disparaît après son jour ; un mois de Fondamentaux après ce mois.
  function encoreValable(a) {
    if (a.date && a.date < today) return false;
    if (a.mois && a.mois < thisMonth) return false;
    return true;
  }

  // Bouton : { label, href } | { label, link: "diagnostic" | "newsletter" } | { label, page }
  function bouton(b, extraClass) {
    if (!b) return "";
    var attrs = b.link ? ' data-link="' + b.link + '" href="#"' : b.page ? ' data-page="' + b.page + '" href="/"' : ' href="' + esc(b.href) + '"';
    if (b.link === "newsletter" || (b.href && /^https?:/.test(b.href))) attrs += ' target="_blank" rel="noopener"';
    var html = '<a class="btn' + (extraClass ? " " + extraClass : "") + '"' + attrs + ">" + esc(b.label) + " " + ARROW + "</a>";
    if (b.note) html += '<p class="cta__note">' + esc(b.note) + "</p>";
    return html;
  }

  function section(cls, inner, attrs) {
    return '<section class="section ' + cls + '"' + (attrs || "") + '><div class="wrap">' + inner + "</div></section>";
  }

  // Blocs complémentaires. Un bloc avec avant: true s'affiche juste après la présentation,
  // les autres après « Comment ça marche ».
  function renderBloc(b) {
    var inner = '<h2 class="h2">' + esc(b.titre) + "</h2>" + (b.sousTitre ? '<p class="o-lead">' + esc(b.sousTitre) + "</p>" : "");
    if (b.type === "texte") {
      // Paragraphes (HTML : les mots clés en <span class="kw">), cartes, liste, question
      inner += '<div class="o-prose">' + (b.paragraphes || []).map(function (t) { return "<p>" + t + "</p>"; }).join("") + "</div>";
      if (b.cartes && b.cartes.length) {
        inner += '<ul class="o-tendances">' + b.cartes.map(function (c, i) {
          return '<li class="o-tendance o-tendance--' + ["sable", "lilas", "orange", "surface", "sable"][i % 5] + '"><span class="o-tendance__t">' + esc(c.titre) + "</span><span>" + esc(c.texte) + "</span></li>";
        }).join("") + "</ul>";
      }
      if (b.liste && b.liste.length) {
        inner += '<ul class="o-liste">' + b.liste.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul>";
      }
      if (b.question) inner += '<p class="o-question">' + esc(b.question) + "</p>";
    }
    if (b.type === "situations") {
      inner += '<ol class="situations">' + b.items.map(function (s, i) {
        return '<li class="situation situation--' + ["sable", "orange", "surface", "lilas"][i % 4] + '"><span class="steps__n">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<h3 class="situation__t">' + esc(s.titre) + "</h3><p>" + esc(s.texte) + "</p><ul>" +
          s.exemples.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></li>";
      }).join("") +
      (b.conclusion ? '<li class="situation situation--vert"><p class="situation__t">' + b.conclusion.titre + "</p><p>" + esc(b.conclusion.texte) + "</p></li>" : "") + "</ol>";
    } else if (b.type === "cartes") {
      inner += b.groupes.map(function (g) {
        return (g.titre ? '<p class="band__label o-cartes__label">' + esc(g.titre) + "</p>" : "") + '<div class="o-cartes">' +
          g.items.map(function (c) {
            // Sur la page d'atterrissage de l'app, les cartes restent sans lien.
            var lienCarte = c.page && !SUR_APP;
            var tag = lienCarte ? "a" : "div";
            return "<" + tag + ' class="o-carte' + (c.page ? " o-carte--lien" : "") + '"' + (lienCarte ? ' data-page="' + c.page + '" href="/"' : "") + ">" +
              '<span class="o-carte__t">' + esc(c.titre) + "</span><span>" + esc(c.texte) + "</span>" +
              (lienCarte ? '<span class="o-carte__pastille" aria-hidden="true">' + ARROW + "</span>" : "") + "</" + tag + ">";
          }).join("") + "</div>";
      }).join("");
    }
    return section("o-bloc", inner);
  }

  var html = "";

  // 2.1 Présentation
  var p = O.presentation;
  var visuel = "";
  if (p.visuel && p.visuel.type === "image") {
    visuel = '<figure class="o-visuel"><span class="circle circle--lilas o-visuel__c" aria-hidden="true"></span>' +
      '<img class="o-visuel__photo" src="' + p.visuel.src + '" alt="' + esc(p.visuel.alt) + '" width="' + p.visuel.width + '" height="' + p.visuel.height + '" fetchpriority="high" />' +
      (p.visuel.illustration ? '<img class="o-visuel__illu" src="' + p.visuel.illustration + '" alt="" aria-hidden="true" />' : "") +
      "</figure>";
  } else if (p.visuel && p.visuel.type === "bulles") {
    visuel = '<figure class="o-visuel o-visuel--bulles" aria-hidden="true"><span class="circle circle--lilas o-visuel__c1"></span><span class="circle circle--sable o-visuel__c2"></span>' +
      '<img src="/assets/bulles.png" alt="" width="798" height="647" /></figure>';
  } else if (p.visuel && p.visuel.type === "telephone") {
    visuel = '<figure class="o-visuel o-visuel--tel"><span class="circle circle--sable o-visuel__c1" aria-hidden="true"></span>' +
      '<div class="phone" role="img" aria-label="Écran d’accueil de l’application : la séance du jour de 5 minutes">' +
      '<p class="phone__sur">Bonjour</p>' +
      '<p class="phone__titre">Une séance de <span class="kw">5 minutes</span>, rien que pour vous.</p>' +
      '<div class="phone__seance"><p class="phone__petit">Séance du jour · 5 min</p><p class="phone__carte">Rester calme quand une conversation se tend</p><span class="phone__btn">Commencer ' + ARROW + "</span></div>" +
      '<div class="phone__tuiles"><span class="phone__tuile phone__tuile--sable">Préparer une situation</span><span class="phone__tuile phone__tuile--orange">SOS conversation difficile</span></div>' +
      '<div class="phone__nav"><span></span><span></span><span></span><span></span></div>' +
      "</div></figure>";
  }

  html += '<section class="o-hero"><div class="wrap o-hero__grid"><div class="o-hero__text">' +
    (p.surtitre ? '<p class="hero__surtitre">' + esc(p.surtitre) + "</p>" : "") +
    '<h1 class="o-hero__titre">' + esc(p.titre) + "</h1>" +
    (p.texte || []).map(function (t) { return '<p class="' + (t.lead ? "o-lead" : "o-texte") + '">' + t.html + "</p>"; }).join("") +
    (p.pourQui ? '<p class="o-encart"><span class="band__label">Pour qui</span> ' + p.pourQui + "</p>" : "") +
    (p.dansQuelCas ? '<p class="o-encart"><span class="band__label">Dans quel cas ?</span> ' + esc(p.dansQuelCas) + "</p>" : "") +
    // La mention (ex. date de lancement) s'affiche juste au-dessus du bouton.
    (p.mention ? '<p class="o-mention">' + esc(p.mention) + "</p>" : "") +
    (p.bouton ? '<div class="cta">' + bouton(p.bouton) + "</div>" : "") +
    "</div>" + visuel + "</div></section>";

  // Galerie (photos sous la présentation)
  if (O.galerie && O.galerie.length) {
    html += '<section class="o-galerie" aria-label="Photos"><div class="wrap o-galerie__grid">' +
      O.galerie.map(function (g) {
        return '<img src="' + g.src + '" alt="' + esc(g.alt) + '" width="' + g.width + '" height="' + g.height + '" loading="lazy" decoding="async" />';
      }).join("") + "</div></section>";
  }

  (O.blocs || []).filter(function (b) { return b.avant; }).forEach(function (b) { html += renderBloc(b); });

  // 2.2 Preuve d'autorité
  var A = O.autorite || {};
  html += '<section class="o-autorite" aria-label="Agnès Candiotti"><div class="wrap">' +
    (SUR_APP ? '<div class="o-agnes">' : '<a class="o-agnes" href="' + ((window.PA_CONFIG && window.PA_CONFIG.SITE_URL) || "") + '/#agnes">') + '<img src="/assets/agnes.webp" alt="Portrait d’Agnès Candiotti" width="96" height="96" loading="lazy" />' +
    '<span><span class="o-agnes__nom">Agnès Candiotti</span><span>coach professionnelle certifiée</span>' +
    (A.extra ? '<span class="kw">' + esc(A.extra) + "</span>" : "") + "</span>" + (SUR_APP ? "</div>" : "</a>") +
    ((A.elements || []).length ? '<ul class="o-preuves">' + A.elements.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : "") +
    "</div>" +
    '<div class="logos o-logos">' + (A.titreLogos ? '<p class="logos__titre">' + esc(A.titreLogos) + "</p>" : "") +
    '<ul class="wrap logos__row">' +
    [["quebec", "Secrétariat du Conseil du Trésor du Québec", 200], ["education", "Ministère de l’Éducation nationale et de la Jeunesse", 128], ["green-management-school", "Green Management School", 184], ["enercoop", "Enercoop", 130], ["skc-gap-tallard", "SKC Gap Tallard", 94], ["superprof", "Superprof", 142]]
      .map(function (l) { return '<li><img src="/assets/logos/' + l[0] + '.jpg" alt="' + l[1] + '" width="' + l[2] + '" height="74" loading="lazy" /></li>'; }).join("") +
    "</ul></div></section>";

  // 2.3 Témoignages écrits
  if (O.temoignages) {
    html += section("o-temoignages",
      '<h2 class="h2">' + esc(O.temoignages.titre) + "</h2>" +
      '<div class="cards" data-temoignages="' + O.temoignages.bloc + '"' + (O.temoignages.couleurs ? ' data-couleurs="' + O.temoignages.couleurs + '"' : "") + "></div>");
  }

  // 2.3 bis Témoignages vidéo : masqués tant qu'il n'y en a pas
  // Format : { titre, src (adresse d'intégration), nom, fonction }
  if (O.temoignagesVideo && O.temoignagesVideo.length) {
    html += section("o-videos",
      '<div class="videos">' + O.temoignagesVideo.map(function (v) {
        return '<div class="video"><div class="video__frame" data-video-src="' + esc(v.src) + '" data-video-title="' + esc(v.titre || "Témoignage vidéo") + '">' +
          '<button class="video__poster" type="button" data-video-play><span class="circle circle--sable video__c1" aria-hidden="true"></span><span class="circle circle--lilas video__c2" aria-hidden="true"></span>' +
          '<span class="video__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="visually-hidden">Lire la vidéo</span></button></div>' +
          (v.nom ? '<p class="tcard__name">' + esc(v.nom) + "</p>" : "") + (v.fonction ? '<p class="tcard__role">' + esc(v.fonction) + "</p>" : "") + "</div>";
      }).join("") + "</div>");
  }

  // 2.4 Lien vers la page de vente
  var V = O.vente;
  if (V) {
    var groupes = (V.groupes || []).map(function (g) {
      var actions = (g.actions || []).filter(encoreValable);
      if (!actions.length) return "";
      return '<div class="o-groupe">' + (g.titre ? '<h3 class="h3">' + esc(g.titre) + "</h3>" : "") +
        (g.infos && g.infos.length ? '<ul class="chips">' + g.infos.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" : "") +
        '<div class="o-actions">' + actions.map(function (a) { return bouton(a, g.secondaire ? "btn--outline" : ""); }).join("") + "</div></div>";
    }).join("");
    if (groupes) html += '<section class="o-vente" id="inscription"><div class="wrap"><div class="o-vente__box">' + groupes + "</div></div></section>";
  }

  // 2.5 Comment ça marche
  if (O.etapes && O.etapes.length) {
    html += section("o-etapes",
      '<h2 class="h2">Comment ça marche</h2><ol class="steps">' +
      O.etapes.map(function (e, i) {
        return '<li><span class="steps__n">' + String(i + 1).padStart(2, "0") + "</span>" +
          (e.titre ? '<span class="steps__t">' + esc(e.titre) + "</span>" : "") + "<span>" + esc(e.texte) + "</span></li>";
      }).join("") + "</ol>");
  }

  (O.blocs || []).filter(function (b) { return !b.avant; }).forEach(function (b) { html += renderBloc(b); });

  // 2.6 FAQ : masquée tant qu'elle est vide. Format : { question, reponse }
  if (O.faq && O.faq.length) {
    html += section("o-faq", '<h2 class="h2">FAQ</h2><div class="faq">' + O.faq.map(function (q, i) {
      return '<div class="faq__item"><h3 class="faq__q"><button type="button" aria-expanded="false" aria-controls="faq-' + i + '">' + esc(q.question) + '<span class="faq__icone" aria-hidden="true"></span></button></h3>' +
        '<div class="faq__r" id="faq-' + i + '" hidden><p>' + esc(q.reponse) + "</p></div></div>";
    }).join("") + "</div>");
  }

  // 2.7 Rappel du bouton en fin de page
  if (O.rappel) {
    html += '<section class="final"><span class="circle circle--sable final__c1" aria-hidden="true"></span><span class="circle circle--lilas final__c2" aria-hidden="true"></span>' +
      '<div class="wrap final__inner">' + (O.rappel.titre ? '<h2 class="h2">' + esc(O.rappel.titre) + "</h2>" : "") +
      '<div class="cta cta--center">' + bouton(O.rappel.bouton) + "</div></div></section>";
  }

  main.innerHTML = html;

  // FAQ : ouverture au clic et au clavier (vrai bouton)
  main.querySelectorAll(".faq__q button").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", open ? "false" : "true");
      document.getElementById(b.getAttribute("aria-controls")).hidden = open;
    });
  });
})();
