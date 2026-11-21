(function () {
  var C = window.PA_CONFIG;

  // Paramètres UTM de la page, transmis au diagnostic.
  var utm = new URLSearchParams();
  new URLSearchParams(location.search).forEach(function (v, k) {
    if (k.indexOf("utm_") === 0) utm.append(k, v);
  });

  function withUtm(url) {
    var q = utm.toString();
    if (!q) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + q;
  }

  // Liens vers l'app, la newsletter et les pages dédiées : une seule source, config.js.
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link");
    if (key === "diagnostic") a.href = withUtm(C.LINKS.diagnostic);
    else if (key === "app") a.href = C.LINKS.app;
    else if (key === "connexion") a.href = C.LINKS.connexion;
    else if (key === "newsletter") a.href = C.NEWSLETTER_URL;
  });
  document.querySelectorAll("[data-page]").forEach(function (a) {
    var url = C.PAGES[a.getAttribute("data-page")];
    if (url) a.href = url;
  });

  // Témoignages.
  // Cycle de 4 : l'orange revient souvent et les couleurs se décalent d'une rangée à l'autre.
  var couleursDefaut = ["sable", "orange", "lilas", "orange"];
  function typo(s) {
    return s.replace(/ ([!?:;])/g, " $1");
  }
  document.querySelectorAll("[data-temoignages]").forEach(function (box) {
    var bloc = box.getAttribute("data-temoignages");
    var couleurs = box.getAttribute("data-couleurs");
    couleurs = couleurs ? couleurs.split(",") : couleursDefaut;
    window.PA_TEMOIGNAGES.filter(function (t) { return t.bloc === bloc; }).forEach(function (t, i) {
      var fig = document.createElement("figure");
      fig.className = "tcard tcard--" + couleurs[i % couleurs.length];
      var q = document.createElement("blockquote");
      q.className = "tcard__quote";
      q.lang = "fr";
      q.textContent = "« " + typo(t.texte) + " »";
      var cap = document.createElement("figcaption");
      cap.className = "tcard__who";
      var img;
      if (t.photo) {
        img = document.createElement("img");
        img.src = t.photo;
        img.alt = "Photo de " + t.nom;
        img.width = 48; img.height = 48;
        img.loading = "lazy"; img.decoding = "async";
      } else {
        // Pas de photo (avis Superprof) : initiale du prénom
        img = document.createElement("span");
        img.className = "tcard__initiale";
        img.setAttribute("aria-hidden", "true");
        img.textContent = t.nom.charAt(0);
      }
      var who = document.createElement("span");
      var nom = document.createElement("span");
      nom.className = "tcard__name";
      nom.textContent = t.nom;
      var fn = document.createElement("span");
      fn.className = "tcard__role";
      fn.textContent = t.fonction;
      who.appendChild(nom); who.appendChild(fn);
      if (t.langue === "en") {
        var tr = document.createElement("span");
        tr.className = "tcard__tr";
        tr.textContent = "Traduit de l'anglais";
        who.appendChild(tr);
      }
      cap.appendChild(img); cap.appendChild(who);
      fig.appendChild(q); fig.appendChild(cap);
      box.appendChild(fig);
    });
  });

  // Menu mobile.
  var toggle = document.querySelector(".menu-toggle");
  var header = document.querySelector(".header");
  // Pas de menu sur la page d'atterrissage de l'app.
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector(".visually-hidden").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Vidéos LinkedIn et Instagram : l'iframe n'est chargée qu'au clic
  // (aucun contenu ni script LinkedIn ou Instagram avant).
  var VIDEOS = {
    linkedin: { src: C.LINKEDIN_EMBED, title: "Vidéo LinkedIn d’Agnès Candiotti" },
    instagram: { src: C.INSTAGRAM_EMBED, title: "Vidéo Instagram de Présence Authentique" },
  };
  document.querySelectorAll("[data-video]").forEach(function (frame) {
    // Vidéo connue (LinkedIn, Instagram) ou adresse donnée par la page (témoignages vidéo).
    var v = VIDEOS[frame.getAttribute("data-video")] ||
      (frame.getAttribute("data-video-src") && { src: frame.getAttribute("data-video-src"), title: frame.getAttribute("data-video-title") || "Vidéo" });
    var play = frame.querySelector("[data-video-play]");
    if (!v || !play) return;
    play.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = v.src;
      iframe.title = v.title;
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("scrolling", "no");
      frame.innerHTML = "";
      frame.classList.add("is-loaded");
      frame.appendChild(iframe);
    });
  });

  // Page d'atterrissage de l'app : aucun lien en dehors du diagnostic et de « Me connecter ».
  // Filet de sécurité pour tout lien venant du contenu de la page.
  if (C.SUR_APP) {
    document.querySelectorAll("a").forEach(function (a) {
      var k = a.getAttribute("data-link");
      if (k === "diagnostic" || k === "connexion" || a.classList.contains("skip")) return;
      var span = document.createElement("span");
      span.className = a.className;
      span.innerHTML = a.innerHTML;
      a.replaceWith(span);
    });
  }
})();
