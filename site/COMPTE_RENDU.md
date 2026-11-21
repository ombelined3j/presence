# Compte rendu : page d'accueil Présence Authentique

Page statique HTML et CSS (choix par défaut, À DÉCIDER n° 6), dans le dossier `site/`.

## Lancer la page en local

```bash
python3 -m http.server 4173 --directory site
```

Puis ouvrir http://localhost:4173. Le port 5173 reste à l'app (à lancer à part avec `npm run dev`).

## Fichiers

| Fichier | Contenu |
|---|---|
| `index.html` | La page |
| `styles.css` | Charte v2 (couleurs, Bricolage Grotesque + Manrope, sans gras) |
| `config.js` | `APP_URL` (seule adresse de l'app), URL des pages dédiées, newsletter, vidéo LinkedIn |
| `main.js` | Liens, transmission des paramètres UTM au diagnostic, témoignages, menu mobile, vidéo au clic |
| `data/temoignages.js` | Les 13 témoignages : original anglais, traduction, nom, fonction, photo, emplacement |
| `data/dojo.js` | Liens dojo du Linktree pour la future page Dojo ; les intros gratuites se masquent après leur date |
| `assets/` | Images (photos en webp, illustrations en png recadrées) |

## Vérifications faites

- Bureau (1280 px) et mobile (375 px) : aucun défilement horizontal, menu repliable, barre fixe du diagnostic en bas sur mobile.
- Un seul `h1`, `lang="fr"`, textes alternatifs sur toutes les images, chargement différé sous la ligne de flottaison.
- Les 6 boutons du diagnostic pointent vers `http://localhost:5173/diagnostic` et reprennent les paramètres `utm_*` de la page (testé avec `?utm_source=test&utm_medium=email`).
- Aucune requête vers LinkedIn avant le clic sur la vignette ; l'iframe se charge au clic.
- Les textes repris du site ont été comparés automatiquement avec la page actuelle : ils sont identiques.
- La phrase « Votre résultat s'affiche avant la création de compte. » est vraie dans l'app actuelle : `/diagnostic/resultat` est une page publique, la création de compte vient après.
- Aucun emoji, aucun tiret cadratin dans les textes affichés (les tirets cadratins restent dans les textes anglais d'origine, conservés dans le fichier de données sans être affichés).
- Contrastes : aucun texte vert sur sable, lilas ou orange. Sur ces fonds, les mots clés passent en encre, plus grands. L'orange ne touche jamais le vert : les bandes sont séparées par du beige, les cartes orange sous la bande SOS conversation difficile en sont séparées par du beige.

## Féminin : phrases modifiées

**Aucune.** Les textes repris dans cette page ne contiennent pas d'accord au féminin adressé au visiteur. Les phrases concernées sur le site se trouvent dans des sections que le brief ne reprend pas :

- « Vous êtes salariée », « Vous êtes indépendante » (section des profils)
- « rester alignée » (section parcours en cinq étapes)
- « les dirigeantes, manageures » (section organisations, retirée par défaut, À DÉCIDER n° 4)

À traiter si l'une de ces sections revient.

## Traductions des témoignages, à valider par Agnès

Les 13 témoignages sont en anglais sur le site. Chacun porte la mention « Traduit de l'anglais ». Règle suivie : quand une tournure française aurait imposé un accord masculin ou féminin pour la personne (« m'a aidé / aidée », « reconnaissant / reconnaissante »), j'ai choisi une tournure qui n'en demande pas, pour ne pas deviner le genre à partir du prénom. Les tirets cadratins de l'original sont remplacés par une virgule, deux-points ou un point.

**Varsha Pingale**
- Original : I’m a fan of every practice and service that Agnès offers simply because it comes from her commitment to being authentic and to bring out the authenticity in others. A recent session helped me take first crucial steps towards designing a group program that I’ve been meaning to launch since months.
- Traduction : Je suis fan de toutes les pratiques et de tous les services qu’Agnès propose, tout simplement parce qu’ils viennent de son engagement à être authentique et à faire émerger l’authenticité chez les autres. Grâce à une séance récente, j’ai pu franchir les premières étapes cruciales vers la conception d’un programme de groupe que je voulais lancer depuis des mois.

**Stéphanie Pasquet**
- Original : Agnès has a remarkable talent for allowing each participant’s way of being to emerge, welcoming it, and empowering it. She knows how to create both group and individual spaces of true freedom, which allow natural talents and each person’s leadership to come forth.
- Traduction : Agnès a un talent remarquable pour permettre à la manière d’être de chaque participant d’émerger, pour l’accueillir et la renforcer. Elle sait créer, en groupe comme en individuel, des espaces de véritable liberté, qui permettent aux talents naturels et au leadership de chacun de se révéler.

**Catherine Le Liboux**
- Original : Agnès' gentle facilitation helped me shift into a state of flow and love. To be able to name how I was feeling in that non-judgmental space was a relief. If you're reading this and considering working with Agnes — know that her presence is a gift.
- Traduction : Grâce à l’animation douce d’Agnès, j’ai pu basculer dans un état de fluidité et d’amour. Pouvoir nommer ce que je ressentais dans cet espace sans jugement a été un soulagement. Si vous lisez ces lignes et envisagez de travailler avec Agnès, sachez que sa présence est un cadeau.

**David-Michael Lozupone Ph.D**
- Original : Agnès is a rare find! She holds space with such presence, empathy, and curiosity—completely free of judgment. Her thoughtful questions guided me toward deeper awareness and self-exploration. I’m deeply thankful for the experience!
- Traduction : Agnès est une perle rare ! Elle tient l’espace avec tant de présence, d’empathie et de curiosité, sans le moindre jugement. Ses questions réfléchies m’ont ouvert la voie vers une conscience plus profonde et l’exploration de soi. J’éprouve une profonde gratitude pour cette expérience !

**Jeanne Guillaume**
- Original : The workshop led by Agnès was a transformative experience for the participants. It marked a turning point in their group cohesion—a deeply human and enriching experience rooted in strong values and relational intelligence. It’s the kind of moment that should happen more often to truly become part of our daily lives.
- Traduction : L’atelier animé par Agnès a été une expérience transformatrice pour les participants. Il a marqué un tournant dans la cohésion de leur groupe : une expérience profondément humaine et enrichissante, ancrée dans des valeurs fortes et l’intelligence relationnelle. C’est le genre de moment qui devrait se produire plus souvent pour véritablement faire partie de notre quotidien.

**Serge Andriamihaja PhD**
- Original : Agnès has transformed my life in an extraordinary way! Thanks to her compassionate guidance, expertise, and wisdom, I was able to make changes I never thought possible. If you’re looking for a coach who combines empathy, clarity, and contagious energy—look no further! She is THE person who will guide you toward your full potential.
- Traduction : Agnès a transformé ma vie de façon extraordinaire ! Grâce à son accompagnement empreint de compassion, son expertise et sa sagesse, j’ai pu opérer des changements que je n’aurais jamais crus possibles. Si vous cherchez une coach qui allie empathie, clarté et énergie contagieuse, ne cherchez plus ! C’est LA personne qui vous guidera vers votre plein potentiel.

**Antoine Costes Ph.D**
- Original : Agnès is a highly methodical, warm-hearted coach. She gave me simple and powerful somatic tools to unlock the moods I felt trapped in. Every session brings practical results. She gently but efficiently brings me to overcome my mental barriers with so much tactfulness that I always felt in the center and aware. I'm very grateful for the durable self-confidence it brought me to move on in my life !
- Traduction : Agnès est une coach très méthodique et chaleureuse. Elle m’a donné des outils somatiques simples et puissants pour débloquer les humeurs qui m’emprisonnaient. Chaque séance apporte des résultats concrets. Avec douceur mais efficacité, elle m’amène à dépasser mes barrières mentales, avec tant de tact qu’à chaque instant je me sentais dans mon centre et en pleine conscience. Je ressens une grande gratitude pour la confiance en moi durable que cela m’a apportée pour avancer dans ma vie !

**Veronica Hong**
- Original : Agnès has a natural talent of holing a safe and caring space that nurtures deep connections. In one-to-one sessions, she guided me through inner discovery that generated impactful insights. Her present was gentle and made me feel truly supported. I felt comfortable being myself and sharing all my vulnerabilities and feelings.
- Traduction : Agnès a un talent naturel pour tenir un espace sécurisant et bienveillant, qui nourrit des liens profonds. En séances individuelles, elle a guidé mon exploration intérieure, source de prises de conscience marquantes. Sa présence était douce, et j’ai eu le sentiment d’un vrai soutien. J’étais à l’aise pour être moi-même et partager toutes mes vulnérabilités et mes ressentis.
- Note : « holing » et « Her present » sont des coquilles de l'original (holding, presence) ; traduites selon le sens.

**Charles Normand**
- Original : The interactive learning experience delivered by Agnès and her colleague was rated by our employees as the most popular training of the year. It was inspirational, impactful and successful!
- Traduction : L’expérience d’apprentissage interactive animée par Agnès et son binôme a été désignée par nos employés comme la formation la plus appréciée de l’année. Elle était inspirante, percutante et réussie !
- Note : « her colleague » ne dit pas s'il s'agit d'un collègue ou d'une collègue ; « son binôme » évite de choisir. À remplacer par « son collègue » ou « sa collègue » si Agnès le confirme.

**Lucie Marcoux MA**
- Original : What a joy it is to work with a facilitator and coach like Agnès! The depth of her skills is remarkable – and her human-centered approach fills me with energy to go beyond my limits.
- Traduction : Quelle joie de travailler avec une facilitatrice et coach comme Agnès ! La profondeur de ses compétences est remarquable, et son approche centrée sur l’humain me remplit d’énergie pour dépasser mes limites.

**Gisele Dudognon**
- Original : This morning session was truly inspiring—The participants were delighted, and I personally appreciated your gentle and calm presence, which created a space where everyone felt comfortable speaking up. I was especially moved to see even the most reserved participants engage with ease.
- Traduction : La séance de ce matin était vraiment inspirante. Les participants étaient ravis, et j’ai personnellement apprécié votre présence douce et calme, qui a créé un espace où chacun se sentait à l’aise pour prendre la parole. Ce qui m’a particulièrement touché, c’est de voir même les participants les plus réservés s’impliquer avec aisance.

**Naomie Thompson**
- Original : Agnès creates a safe, non-judgmental space where vulnerability becomes a strength. Her insightful questions and deep listening guided me to embrace my true self. She is more than a coach—she facilitates true personal transformation.
- Traduction : Agnès crée un espace sécurisant et sans jugement, où la vulnérabilité devient une force. Ses questions perspicaces et son écoute profonde m’ont permis d’accueillir qui je suis vraiment. Elle est bien plus qu’une coach : elle rend possible une véritable transformation personnelle.

**Emilie Gregoire**
- Original : I love Agnès' undeniable quality of presence, her sensitive listening, her gentleness, and the way she invites slowing down. I feel safe in the spaces she facilitates. I also appreciate her humility, which to me reflects true professionalism, authenticity, and tremendous growth potential.
- Traduction : J’aime l’indéniable qualité de présence d’Agnès, son écoute sensible, sa douceur et sa façon d’inviter au ralentissement. Je me sens en sécurité dans les espaces qu’elle anime. J’apprécie aussi son humilité, qui reflète à mes yeux un vrai professionnalisme, de l’authenticité et un formidable potentiel d’évolution.

## Écarts entre le brief et le site, tranchés en faveur du site

1. **Fonctions des témoignages.** Le tableau 4.5 donne certaines fonctions en français, mais le brief dit aussi de les garder « telles qu'écrites sur le site ». J'ai repris le site :
   - Varsha Pingale : « Psychologist » (tableau : « Psychologue »)
   - Charles Normand : « HR Innovation & Leadership Skills Development at the Secretariat of the Treasury Board of Quebec » (tableau : version française)
   - Serge Andriamihaja PhD : « Educational Entreprenor », coquille d'origine (tableau : « Entrepreneur en éducation »)
   - Emilie Gregoire : « Founder of iTer AGIR » (tableau : « Fondatrice d'iTer AGIR »)
   - Gisele Dudognon et Jeanne Guillaume : « at the Green Management School » (tableau : virgule)
   - Noms : « David-Michael Lozupone Ph.D », « Serge Andriamihaja PhD », « Antoine Costes Ph.D », « Lucie Marcoux MA », comme sur le site.
   - Le brief renvoie à un « À DÉCIDER n° 11 » qui n'existe pas (la liste s'arrête au n° 10).
2. **« Pourquoi est-ce si difficile? »** : le brief parle de 4 paragraphes, le site en a 5 (4 plus la conclusion en gras). Les 5 sont repris, la conclusion en vert.
3. **Accroche** (demande d'Ombeline, remplace celle du PDF) : celle du site actuel, « Abordez les conversations difficiles avec plus de clarté, de confiance et d'impact. ». Le site écrit « les conversation difficiles » : la coquille est corrigée au pluriel. Mots clés en vert : « clarté, de confiance et d'impact. » L'accroche du PDF (« Cette conversation que vous redoutez ? Préparez-vous à l'avoir. ») est réservée à la bande Application, sous son titre. « Préparez-vous à l'avoir. » y est en vert sur sable, en grande taille (28 à 40 px) : le contraste de 4,2:1 est suffisant pour un grand texte.
4. **Photo À propos** (À DÉCIDER n° 7) : `DSC01842.webp` est la photo utilisée sur le site actuel. C'est donc la même.

## Textes et informations manquants

À la demande d'Ombeline, aucun emplacement « [À FOURNIR] » n'est affiché. Quand un texte manque, l'élément n'apparaît pas, et aucun texte n'est inventé pour le remplacer. Il reste à fournir :

- Accueil : titre de la section des autres offres (la section n'a pas de titre visible), texte de présentation de la newsletter, images des vignettes vidéo, liens LinkedIn, Instagram et Facebook, mentions légales.
- Dojo et Immersions : un titre (`h1`). En attendant, le titre est le nom de l'offre (« Dojo Relationnel », « Immersion »).
- Toutes les pages d'offres : éléments de crédibilité (certifications, années d'expérience, personnes accompagnées, formations, interventions), titre de la bande de logos, meta descriptions.
- Dojo : informations pratiques des Fondamentaux (prix, durée, nombre de séances, format), étape « Et ensuite ».
- SOS conversation difficile : délai pour obtenir un rendez-vous, prix, durée, format, étapes après le paiement.
- Immersions : lieu, dates, durée, taille du groupe, prix, ce qui est inclus, lien d'inscription, étapes.

## Changements demandés après la première version

- **Hiérarchie** : menu, bandes d'offres et pied de page dans l'ordre Application, Dojo, Immersions, Newsletter. Le Coaching est gardé, en dernier (décision d'Ombeline).
- **Newsletter** : nouveau bloc dans les offres, entre Immersions et Coaching, avec le bouton « S'inscrire à la liste de diffusion ». Texte de présentation : [À FOURNIR].
- **Hero** : les bonhommes sont retirés. Il ne reste que deux ronds (lilas et sable) et les bulles de dialogue.
- **Ligne sur Agnès dans le hero** : « Agnès Candiotti, coach professionnelle certifiée. » Le féminin est gardé, parce que la phrase parle d'Agnès et pas au visiteur. La section À propos garde le texte complet du site, avec « biologiste de formation ».
- **Hero inspiré de matthewhussey.com** : surtitre « Agnès Candiotti · coach professionnelle certifiée », grand portrait à côté du titre (sur mobile, au-dessus), puis une bande de logos juste sous le hero. Portrait et logos sont découpés dans l'image de header fournie (`1784893786370.jpeg`). Le texte « OSER LES CONVERSATIONS DIFFICILES » de cette image n'est pas repris : le titre reste le `h1` de la page. Les ronds et la bulle lilas sont gardés autour du portrait.
  - L'image fait seulement 1400 x 349 px. Le portrait recadré mesure 330 x 270 px et paraît flou sur les écrans haute définition. **Il faudrait la photo d'origine en grand.**
  - Logos : Secrétariat du Conseil du Trésor du Québec, Ministère de l'Éducation nationale et de la Jeunesse, Green Management School, Enercoop, SKC Gap Tallard, Superprof. La bande n'a pas de titre visible, et le libellé pour lecteur d'écran (« Organisations accompagnées ») est à valider. Vérifier aussi qu'Agnès a le droit d'afficher ces logos sur son site.
- **« Commencez ici »** : remplace « Par où souhaitez-vous commencer ? ». Cette section ne contient que l'application, et son bouton mène au diagnostic gratuit (même libellé et même phrase dessous que les autres boutons du diagnostic). Dojo, Immersions, Newsletter et Coaching passent dans une section suivante, dont le titre est [À FOURNIR].
- **Avis Superprof** : les 7 avis de la page Superprof d'Agnès sont ajoutés sous Coaching (séances individuelles). Il y a maintenant 9 témoignages dans ce bloc.
  - Texte exact, coquilles comprises (« je n'aurai jamais cru », « les trouve nous-même », « socio-ecologique »).
  - Pas de photo : une initiale est affichée à la place. Sous le nom : « Avis Superprof » ou « Recommandation Superprof ». Superprof présente les recommandations comme venant « des proches et des connaissances » d'Agnès.
  - Deux avis sont publiés sous le nom d'Agnès, avec la mention « (Daphné S., Belgique) » ou « (Kevin R.) » à la fin du texte. Cette mention est affichée comme nom, et le texte complet reste dans le fichier de données.
  - L'avis de Dave est en anglais et a été traduit, à valider (voir ci-dessous).
  - Doublons possibles, à faire vérifier par Agnès : Antoine, Dave, Jeanne et Lucie sont peut-être Antoine Costes, David-Michael Lozupone, Jeanne Guillaume et Lucie Marcoux, qui ont déjà un témoignage sur la page.

**Traduction, Dave (Superprof)**
- Original : Agnès is a rare find! I feel completely held in her attention - feeling really seen by her. She has such a human approach; we often find laughter in the things that feel hard for me which is a welcomed lightness. She has a kindness and gentleness matched by her effective and thoughtful questions that ask me to really examine myself. I think she is genuinely curious about the person on the other side of the screen and takes everything in without judgement – this subtle way of being is contagious and has me exploring my inner world with the same level of non-judgmental kindness. With Agnès I feel led to a deeper awareness and I feel thankful to have gotten to work with her.
- Traduction : Agnès est une perle rare ! Son attention me porte pleinement : j’ai le sentiment qu’elle me voit vraiment. Son approche est profondément humaine ; nous rions souvent de ce qui me semble difficile, et cette légèreté est bienvenue. Sa gentillesse et sa douceur vont de pair avec des questions efficaces et réfléchies, qui m’invitent à vraiment m’examiner. Je crois qu’elle s’intéresse sincèrement à la personne de l’autre côté de l’écran et qu’elle accueille tout sans jugement : cette manière d’être subtile est contagieuse, et elle m’amène à explorer mon monde intérieur avec la même bienveillance, sans jugement. Avec Agnès, j’avance vers une conscience plus profonde, et j’éprouve de la gratitude d’avoir pu travailler avec elle.
- **Phrase sous les boutons du diagnostic** : « 10 questions, diagnostic gratuit. » sous les 4 boutons (hero, sous les témoignages, Commencer ici, appel final). La phrase « Votre résultat s'affiche avant la création de compte. » est retirée. Dans l'appel final, le texte du PDF passe de « 3 à 5 questions » à « 10 questions », pour rester cohérent.
- **Prix et langue de l'application** : « 30 €/mois » et « En français » sont retirés de la bande Application.
- **Coaching renommé « SOS conversation difficile »** : dans le menu, le pied de page, le titre de la bande et le bouton (« Découvrir SOS conversation difficile », libellé à valider). L'ancre de la page reste `#coaching`.
- **Couleurs des témoignages** : les cartes suivent un cycle sable, orange, lilas, orange. L'orange revient une carte sur deux, et les couleurs se décalent d'une rangée à l'autre. Cela s'applique aussi au bloc sous la bande SOS conversation difficile (vert). Les cartes y sont séparées de la bande par 24 px de beige, donc l'orange ne touche pas le vert.
- **Vidéo Instagram** : le reel de @presenceauthentique est ajouté dans À propos, à côté de la vidéo LinkedIn (côte à côte sur ordinateur, l'une sous l'autre sur mobile). Comme pour LinkedIn, une vignette aux couleurs de la charte s'affiche d'abord, et la vidéo ne se charge qu'au clic. Le code d'intégration fourni charge le script `embed.js` d'Instagram dès l'ouverture de la page : il n'est pas utilisé. La page appelle directement l'adresse d'intégration du reel, réglée dans `config.js`. Vérifié : aucune requête vers Instagram ou LinkedIn avant le clic.

## Choix appliqués par défaut

- Témoignages : répartition du brief (À DÉCIDER n° 1 et 2). À vérifier par Agnès : Jeanne Guillaume et Gisele Dudognon parlent d'ateliers de groupe, Charles Normand d'une formation, Veronica Hong de séances individuelles. Ces témoignages ne correspondent peut-être pas à l'offre sous laquelle ils sont placés.
- Photo de paysage de la bande Immersions : le lac de montagne. Les deux autres photos sont dans `assets/` pour la page dédiée. Aquarelle non utilisée (À DÉCIDER n° 9).
- Section organisations : retirée (À DÉCIDER n° 4).
- Pas de lien « Se connecter » (À DÉCIDER n° 8).
- Libellé de l'onglet newsletter : « Newsletter » (à valider).
- Barre fixe mobile : même libellé que le bouton principal.

## Texte ajouté, à valider

Sous la vignette vidéo, une mention RGPD : « La vidéo est hébergée par LinkedIn. En cliquant sur lecture, vous acceptez le chargement de ce contenu, qui peut déposer des cookies. » Elle ne vient d'aucune source : elle est marquée [À FOURNIR] et doit être validée.

## RGPD

- LinkedIn et Instagram : rien n'est chargé avant le clic, qui vaut consentement pour ce contenu. La page ne contient aucun autre traceur, donc pas besoin de bandeau de cookies pour l'instant.
- Polices : elles sont chargées depuis Google Fonts, ce qui envoie l'adresse IP des visiteurs à Google. Avant la mise en ligne, il vaut mieux les héberger sur le site (fichiers à télécharger depuis Google Fonts).
- Si un outil de mesure d'audience est ajouté, prévoir un bandeau de consentement.

## Avant la mise en ligne

- Remplacer `APP_URL` dans `config.js` par l'URL de production de l'app. La page ne doit pas être publiée avec les liens localhost.
- Photos des témoignages : elles pèsent environ 200 Ko chacune en 750 px pour un affichage en 48 px. Il faudra les réduire (aucun outil de conversion webp sur cet ordinateur).
- Valider les traductions, les phrases « Dans quel cas ? » et les libellés de boutons avec Agnès.


## Pages d'offres (brief `Brief_landing_pages_offres.md`)

Quatre pages, construites sur un seul gabarit (`js/offre.js`). Le contenu de chaque page est dans un fichier de données (`data/offres/`) :

| Page | Adresse | Données |
|---|---|---|
| Application | `/application/` | `data/offres/application.js` |
| Dojo | `/dojo/` | `data/offres/dojo.js` |
| SOS conversation difficile | `/sos-conversation-difficile/` | `data/offres/sos.js` |
| Immersions | `/immersions/` | `data/offres/immersions.js` |

- L'en-tête, le pied de page et la barre fixe mobile sont communs à toutes les pages, accueil compris (`js/layout.js`). Sur chaque page d'offre, l'onglet de la page est en vert.
- Le menu suit l'ordre Application, Dojo, SOS conversation difficile, Immersions, Newsletter (SOS avant Immersions, à la demande d'Ombeline).
- Les onglets et les boutons des bandes de l'accueil ouvrent ces pages. La bande Application de l'accueil garde son bouton vers le diagnostic, et un lien « Découvrir l'application » s'y ajoute (libellé à valider).
- Diagnostic : `http://localhost:5173/diagnostic`, avec les paramètres UTM. Newsletter : le formulaire Brevo.
- Les témoignages vidéo et la FAQ sont prévus dans les fichiers de données, mais vides : ces sections ne s'affichent pas. La FAQ s'ouvre avec de vrais boutons (`aria-expanded`), utilisables au clavier.
- Chaque page se termine par un rappel du bouton principal.
- Vérifié sur ordinateur et sur mobile : aucune erreur, aucun débordement horizontal, aucun « [À FOURNIR] » affiché.

**Choix faits, à valider**

- **Application** : conformément aux demandes d'Ombeline, pas de prix ni de « En français ». Les informations au-dessus du bouton sont « Diagnostic gratuit », « 1 semaine offerte », « Web app, rien à télécharger », « France, Belgique, Suisse et Québec. ». L'étape 1 dit « 10 questions » (au lieu de « 3 à 5 »), et la phrase sous le bouton est « 10 questions, diagnostic gratuit. ». La maquette de téléphone est reproduite en HTML d'après la charte. Les 7 situations, l'encadré « Vous choisissez la situation, la séance s'adapte. » et « Dans la durée » sont repris du PDF. Les cartes Dojo et SOS mènent à leurs pages.
- **Dojo** : les boutons d'intro reprennent les libellés du Linktree, avec « 13h-14h, heure de Paris ». Une intro disparaît après sa date, et un mois de Fondamentaux une fois ce mois terminé. Le bouton du haut et le rappel mènent à la prochaine intro. Le visuel est la photo `1779787784360.jpeg`, sans les bonhommes. À DÉCIDER n° 10 : cette photo a-t-elle été prise pendant un dojo ?
- **SOS conversation difficile** : surtitre « Coaching ». Le bouton de paiement Brevo reprend le libellé du bouton du site actuel, « SOS conversation difficile » (à valider). Témoignages : David-Michael Lozupone, Jeanne Guillaume et les 7 avis Superprof. Seule l'étape « Vous réservez et payez en ligne. » est affichée.
- **Immersions** : la grande photo est le groupe en montagne. Elle porte le logo WeFlow (À DÉCIDER n° 11). La galerie montre le bain nordique, la forêt et le lac. Il n'y a pas de lien d'inscription, et aucun bouton vers la liste de diffusion (demande d'Ombeline) : la page n'a donc ni bouton dans la présentation, ni bloc d'inscription, ni rappel en fin de page. Il n'y a pas d'étapes à afficher. Le lien d'inscription s'ajoute dans `data/offres/immersions.js` quand il existera. L'onglet « Newsletter » et le bouton du pied de page restent, puisqu'ils sont communs à toutes les pages. Les photos Unsplash ne sont plus utilisées, sur aucune page : la bande Immersions de l'accueil montre le lac.
- **Preuve d'autorité** : photo, « Agnès Candiotti », « coach professionnelle certifiée » (sans « biologiste de formation », comme dans le header de l'accueil, alors que le brief demande la formulation complète : à trancher). Sur l'application, la phrase « Les séances sont conçues par Agnès. » s'ajoute. Les 6 logos sont découpés un par un dans la bannière, affichés en gris et à la même hauteur. La bande de logos n'a pas de titre tant que la nature de la relation n'est pas fournie (À DÉCIDER n° 6). Le profil Superprof d'Agnès donne des éléments de crédibilité (doctorat en sciences cognitives en 2012, coach depuis 2018, certification The Connection Institute en 2023, niveau ACC ICF, CNV depuis 2012). Ils ne sont pas affichés : à valider avant de les utiliser.

**Photos des témoignages : association fichier, nom**

Sur presenceauthentique.com, chaque photo de témoignage a un nom de fichier (`5.png`, `2.png`...) identique au nom du portrait `.webp` correspondant dans le dossier Presence. L'association s'appuie sur ces noms. Les 13 photos ont trouvé leur témoignage.

| Fichier | Nom |
|---|---|
| `5.webp` | David-Michael Lozupone Ph.D |
| `2.webp` | Gisele Dudognon |
| `7.webp` | Catherine Le Liboux |
| `1.webp` | Charles Normand |
| `6.webp` | Naomie Thompson |
| `4.webp` | Jeanne Guillaume |
| `4+copy.webp` | Serge Andriamihaja PhD |
| `8.webp` | Varsha Pingale |
| `3.webp` | Lucie Marcoux MA |
| `1+copy.webp` | Emilie Gregoire |
| `3+copy.webp` | Antoine Costes Ph.D |
| `1+copy+2.webp` | Veronica Hong |
| `2+copy+2.webp` | Stéphanie Pasquet |

## Autres changements sur l'accueil

- Plus aucun « [À FOURNIR] » affiché. Le titre de la page est « Présence Authentique ». La meta description reprend celle du site actuel (« gagner en solidité et en clarté lors d'une conversation difficile »).
- Les mentions « La vidéo est hébergée par LinkedIn / Instagram… » sont retirées. Les vidéos restent chargées seulement au clic.
- Les vidéos ont maintenant leur propre section, juste avant À propos, avec le titre « Faites connaissance avec Agnès ». La vidéo Instagram passe en premier, avec au-dessus « Qui je suis ». La vidéo LinkedIn suit, avec au-dessus « Professionnel investi, vous trouvez certaines conversations émotionnellement coûteuses ? » (formulation à valider). La newsletter est tout en bas de l'accueil, sous « Commencez par vous connaître. », juste avant le pied de page.
- La bande SOS conversation difficile passe avant Immersions.
- Header : la photo vient de la bannière (`1784893786370.jpeg`), recadrée pour ne montrer qu'Agnès (262 x 270 px, un peu floue en grand). Le surtitre est remplacé par la vignette d'origine sous le bouton : petite photo ronde et « Agnès Candiotti, coach professionnelle certifiée. ».
- Témoignages répartis à peu près également, à valider par Agnès (chaque témoignage apparaît une seule fois sur l'accueil, et le même bloc est repris sur la page de l'offre) :
  - Sous le hero (3) : Varsha Pingale, Daphné S. et Coralie (les deux derniers sont des avis Superprof, courts).
  - Application (4) : Charles Normand, Lucie Marcoux, Naomie Thompson, Kevin R. (Superprof).
  - Dojo (4) : Jeanne Guillaume, Veronica Hong, Gisele Dudognon, Emilie Gregoire (ateliers ou espaces de groupe).
  - SOS conversation difficile (5) : David-Michael Lozupone, et Antoine, Dave, Jeanne, Lucie (Superprof).
  - Immersions (4) : Stéphanie Pasquet, Catherine Le Liboux, Serge Andriamihaja, Antoine Costes.
  - Attention : Stéphanie Pasquet et Catherine Le Liboux ne disent pas avoir suivi une immersion, et Kevin R. ne parle pas de l'application (aucun témoignage ne porte sur l'application). Ces placements servent à équilibrer les blocs.
- Bande de logos : 6 logos séparés, en gris, à la même hauteur.
- Bonhommes : ils n'apparaissent plus que dans la section du diagnostic gratuit (« Commencez par vous connaître. »), parce que chaque couleur correspond à un type de profil. Ils sont posés sur une carte claire, pour que l'orange ne touche pas le fond vert.
- Appel final : le titre devient « Commencez par vous connaître. » (au lieu de « On commence par vous connaître. »).

## Lancer le site

```bash
python3 -m http.server 4173 --directory site
```

Les pages utilisent des chemins qui partent de la racine du site (`/styles.css`...) : elles doivent être servies par un serveur, et ne fonctionnent pas en ouvrant le fichier directement.


## Page Dojo enrichie (document « DOJO_Relationnel_FONDAMENTAUX »)

Le contenu vient du document Google d'Agnès. Juste après la présentation :
- « Comprendre les réflexes relationnels » : les 5 tendances (se retirer, endurer, se suradapter, s'imposer, se conformer) en cartes de couleur, et la question « Est-ce que vous vous reconnaissez dans une ou plusieurs d'entre elles ? ».
- « L'objectif du DOJO Relationnel » (l'attention, l'image de l'Aïkido).
- « Les bénéfices du DOJO Relationnel », avec la question finale.

Après « Comment ça marche » :
- « L'éthique au sein du DOJO Relationnel » (les 5 principes).
- « En pratique » (espace calme, connexion, caméra et micro).

Non repris : la phrase d'accueil « Bienvenue au début de ton parcours d'entraînement ! », le lien de la salle Zoom (privé : « ne pas communiquer le lien à une tierce personne ») et la ligne de contact (déjà dans le pied de page).

Adaptations : tutoiement passé au vouvoiement, mots en gras rendus en vert, « A l'image » corrigé en « À l'image ». Phrases modifiées pour retirer les accords au féminin, à valider :

| Avant | Après |
|---|---|
| rester centrée et claire, même lorsque tu te sens déstabilisée | garder votre centre et votre clarté, même dans les moments de déstabilisation |
| Chaque participante doit donc respecter | Chaque personne doit donc respecter |
| Reste présente et engagée | Restez dans la présence et l'engagement |
| (chacune ses objectifs et ses progrès) | (à chaque personne ses objectifs et ses progrès) |
| où tu peux t'exprimer et ne pas être dérangée | où vous pouvez vous exprimer, à l'abri des interruptions |

Les 5 tendances du document correspondent aux 5 réflexes du diagnostic de l'app (vous retirer, endurer, vous suradapter, vous imposer, faire comme il faut). Sur la page Dojo, ce sont des cartes de couleur, sans les bonhommes.

Accueil : « Dojo » devient « Dojo Relationnel » dans le titre de la bande, le menu et le pied de page. Le bloc Newsletter du bas de l'accueil est supprimé, car il faisait doublon avec le bouton du pied de page.

## Page Application : retours sur l'app

- Nouvelle section « Dans l'app : la séance du jour, et la préparation en plus », avec deux cartes : « Chaque matin : la séance du jour » et « Et en plus, quand vous en avez besoin ». Elle montre que les deux sont inclus : on n'a pas à choisir.
- Nouvelle section « Ce que vous y gagnez » (« Rester stable, même quand ça se tend. »), reprise de la page d'accueil de l'app, avec les ajouts demandés :
  - Oser dire : « … sans culpabiliser, sans vous excuser ni vous justifier, et sans avoir peur de la réaction de l'autre. »
  - Moins ressasser : « Moins rejouer la scène après coup, sans ruminer, et moins vous critiquer. »
- En attente (à discuter vendredi) : cibler uniquement les conversations professionnelles pour l'app, et renvoyer vers SOS pour le personnel. Cela changera les textes de la page Application (par exemple « 7 types de situations, au travail comme dans la vie personnelle »).
- Diagnostic : 10 questions partout (décision d'Ombeline). La page d'accueil de l'app, qui disait 7 questions, est corrigée.

## Application : vie professionnelle uniquement

Décision d'Ombeline : l'application vise uniquement les conversations professionnelles. Toute mention de situation personnelle est retirée de la page Application. Changements :

- Surtitre : « Application d'entraînement pour managers et leaders » (formule reprise de la page d'accueil de l'app).
- Texte de présentation : « …pour exprimer facilement ce qui semblait difficile dans vos échanges professionnels et moins ressasser après coup. »
- Pour qui : « Les managers et leaders qui souhaitent ancrer ce qu’ils ont appris en formation ou en coaching ponctuel et souhaitent pratiquer les conversations difficiles dans leur vie professionnelle : mieux négocier, mieux convaincre, mieux vivre leurs relations professionnelles au quotidien et gagner en performance. » (texte d’Ombeline du 21/11, orthographe corrigée ; « ancrer ce qu’ils ont appris… » en vert)
- Dans quel cas ? : « …ou préparer une situation professionnelle précise. » (aussi sur la bande Application de l'accueil).
- « Et en plus, quand vous en avez besoin » : « Une conversation difficile approche au travail ? »
- Situations : le sous-titre devient « 7 types de situations, au travail. ». Les exemples personnels sont retirés, sans en inventer d'autres : « Dire à un proche combien il compte pour moi », « Annoncer une rupture amoureuse », « Apprendre une mauvaise nouvelle concernant un proche », « Résoudre un désaccord sur la répartition des tâches dans le couple », « Décider ensemble d'un changement de vie important ». Certains types n'ont donc plus que 1 ou 2 exemples : des exemples professionnels sont à fournir pour les compléter.
- « Ce que vous y gagnez » : nouvelle carte « Gagner en performance » (« Mieux négocier, mieux vivre vos relations professionnelles au quotidien et gagner en performance dans votre vie professionnelle. »).
- Restent tels quels : « Je partage quelque chose d'important, de personnel ou de vulnérable. » (« personnel » au sens d'intime, à valider), et les témoignages (mots des clients).
- La page d'accueil de l'app React n'est pas modifiée (décision d'Ombeline : le site seul). Elle parle encore de « 7 types de situations, au travail comme dans la vie personnelle ».

## Application : cible suggérée, sans la nommer (21/11)

Décision d'Ombeline : ne plus écrire « managers et leaders » ni « formation ou coaching » en toutes lettres. La cible est suggérée par les situations citées. L'argument central devient la pratique quotidienne, présentée comme un complément aux accompagnements ponctuels, sans dire qu'elle les remplace.

- Surtitre : « Application d'entraînement quotidien ».
- Titre : inchangé.
- Texte de présentation : « Savoir comment poser une limite, recadrer ou défendre une décision ne suffit pas toujours au moment où la conversation se tend. Ce qui fait la différence, c’est la pratique : 5 minutes par jour, sur votre téléphone, pour rester stable dans vos échanges professionnels et moins ressasser après coup. »
- L'encart « Pour qui » devient « Pourquoi chaque jour » (nouveau champ `pourQuiLabel`, « Pour qui » par défaut sur les autres pages) : « Une formation ou un accompagnement vous donne des clés. Mais une compétence relationnelle se construit comme une compétence physique : par la répétition. Sans pratique régulière, ce que l’on a compris reste théorique, et les anciens réflexes reviennent dès que la tension monte. L’application vous offre cette pratique, chaque jour, pour découvrir ces réflexes ou ancrer ce que vous avez déjà travaillé. » (« par la répétition » en vert)
- Dans quel cas ? (page Application et bande Application de l'accueil) : « Vos journées comptent des échanges à fort enjeu : un feedback à donner, une décision à défendre, une négociation à mener. Vous voulez vous entraîner chaque jour en autonomie, ou préparer une conversation précise. »
- La page Notion Acquisition indique encore que « les supports parlent de managers et leaders » (décision du 30/10) : à mettre à jour.
