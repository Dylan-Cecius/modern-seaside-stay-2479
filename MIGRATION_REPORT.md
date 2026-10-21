# Rapport d’intégration — La Barbe à Papa

## Référence et restauration

- Source validée : `reference/La-Barbe-a-Papa-Apercu-valide.html`
- Taille : 360089 octets
- SHA-256 vérifié : `38298705467a6ba69365211a3293327149529ec3a0e58852d11766c59285324b`
- Point de restauration demandé : `52f0c2bcd8f42374c11d4937d831a37dda000ee5`
- Copie des fichiers remplacés : `reference/backup-52f0c2bcd8f42374c11d4937d831a37dda000ee5/`

## Intégration

- La route `/` sert le contenu, les styles et les deux scripts vanilla de la référence dans l’application React/Vite existante.
- La feuille historique `src/index.css` reste conservée mais n’est plus importée par l’application active. La route `/` injecte uniquement `src/atelier/atelier-reference.css` pendant son montage puis la retire au démontage.
- La page 404 utilise uniquement son module CSS minimal; aucun sélecteur ou pseudo-élément du thème noir/or ne peut atteindre l’accueil.
- Le renderer `window.AtelierScene` et l’instance `window.atelierScene` sont conservés.
- Le démontage retire les listeners locaux et globaux, les deux observers, les RAF en attente, les dialogues ouverts, l’instance WebGL, le canvas React et les drapeaux globaux/d’initialisation.
- Les six photographies utilisent les chemins locaux `/lovable-uploads/...` déjà présents.
- Les anciens composants, pages et médias restent dans les sources, mais sont inactifs sur l’accueil.
- Le comportement 404 existant est conservé.
- Les mentions d’aperçu, de concept et de non-publication ont été remplacées par des informations réelles sur le salon.
- Aucun formulaire de réservation, backend, authentification ou nouvel abonnement n’a été ajouté.
- Aucune publication, modification DNS ou modification de domaine n’a été effectuée.

## Référencement préparé

- Langue : `fr`
- Canonical : `https://labarbeapapa.be/`
- Métadonnées Open Graph et Twitter conservées et harmonisées.
- `robots.txt` et `sitemap.xml` ajoutés pour le domaine public.
- Les aperçus `*.lovable.app` reçoivent dynamiquement `noindex, nofollow`; le domaine public reste indexable.
- JSON-LD limité aux faits confirmés : adresse, horaires mardi–samedi 10 h–19 h, catalogue et six prix.
- Téléphone fictif, géolocalisation non vérifiée, note non sourcée, faux horaires et réservation supprimés.

## Fichiers principaux ajoutés ou modifiés

- `index.html`
- `src/main.tsx`
- `src/pages/Index.tsx`
- `src/index.css`
- `src/pages/NotFound.module.css`
- `src/atelier/atelier-body.html`
- `src/atelier/atelier-reference.css`
- `src/atelier/atelier-scene.js`
- `src/atelier/atelier-site.js`
- `public/robots.txt`
- `public/sitemap.xml`
- `reference/La-Barbe-a-Papa-Apercu-valide.html`
- `AGENTS.md`

## Vérifications effectuées

- `bun run build` : réussi le 1 octobre 2026.
- `tsgo -p tsconfig.app.json --noEmit` : réussi le 1 octobre 2026.
- Source validée : 360089 octets et SHA-256 `38298705467a6ba69365211a3293327149529ec3a0e58852d11766c59285324b` revérifiés.
- CSS original avant `lstrip` : SHA-256 `84452fef2e1b2746b0a036b9ebcaf4e51deaeabeaf36006039d0d22422f7e8a3` revérifié. Le CSS actif correspond à l’original après retrait de son unique saut de ligne initial.
- Script WebGL original avant `lstrip` : SHA-256 `247bf8cae0decd4fe1d2daf4c2706ca32226df4e52d8e2005209e29305425f50` revérifié. Le script actif correspond octet pour octet après `lstrip`; shader et géométrie n’ont pas été modifiés.
- PNG de secours décodé : SHA-256 `07afc2719dac188337942ffb7fd55c719cbb205ead5ccaebf6df06fbb88230dc` revérifié.
- Audit des imports actifs : seul `atelier-reference.css?raw` est référencé; ni `src/index.css` ni `src/App.css` ne sont importés.
- Chromium, bureau 1440 × 1000 et mobile 390 × 844, même navigateur : préférence `lbap-atelier-chrome-motion=off` préchargée pour chaque origine avant rechargement, puis captures de la référence et de l’application.
- Styles calculés identiques sur les deux origines pour `.hero-eyebrow`, ses pseudo-éléments, `h1`, `.price-row`, `.price-row::before` et `.contact`. L’eyebrow vaut `rgb(21, 25, 24)` et `content: none` sur `::before`/`::after`.
- Captures ciblées complètes : tarifs (écart pixel moyen arrondi 0,000004), galerie (0,001805) et contact (0) face à la référence; les écarts du premier écran proviennent uniquement de l’état/instant de rendu WebGL capturé.
- Chromium, mobile 390 × 844 : menu ouvert puis fermé avec Échap; galerie ouverte, passage à `02 / 05`, fermeture Échap; dialogue d’information ouvert et fermé avec Échap.
- Chromium, mobile 375 × 844 : débordement horizontal mesuré à 0 px.
- WebGL actif : renderer `webgl`, 23744 triangles. En état `off`, le compteur est resté à 4 sur deux mesures; après activation il a progressé à 8. La préférence `on` a persisté après rechargement lors du test dédié, puis a été remise à `off`.
- Fallback forcé sans WebGL : renderer `fallback` et PNG statique visibles.
- Ancre directe `/#prestations` : section positionnée à 40 px du haut, conformément au `scroll-padding-top` de la référence.
- Aller-retour SPA `/` → `/inexistant` → `/` : 404 affichée, feuille de référence et globals retirés sur la 404, accueil remonté, puis un clic mouvement produit un seul changement d’état.
- Images : six éléments source et six coquilles chargées.
- Erreurs de page/runtime : aucune. Le seul message console est le diagnostic volontaire de la route 404.

## Points non validés automatiquement

- La pause lors d’un véritable changement d’onglet système reste conservée dans le code, mais n’a pas été marquée comme testée : Chromium automatisé ne reproduit pas fidèlement ce changement de visibilité système.
- Aucun test n’a été réalisé sur la version publiée, conformément à l’interdiction de publier à cette étape.
- Aucun DNS, domaine, dépendance ou autre projet n’a été modifié.

## Galerie : contenu mis à jour (01/10/2026)

- La troisième réalisation (`8ca30b87-12b4-487c-8020-a9a2ba8489bb.png`, libellée « LA FINITION ») a été retirée de la galerie. Le fichier reste dans `public/lovable-uploads/`, simplement plus affiché.
- Quatre photos fournies par le propriétaire ont été ajoutées en fin de carrousel : `coupe-degrade.jpg`, `coupe-texturisee.jpg`, `coupe-decoloree.jpg`, `coupe-lignes.jpg` (copiées dans `public/lovable-uploads/`, comme les photos existantes). Les libellés « LE PROFIL », « LA NUQUE », « LES POINTES », « LES LIGNES » et les textes alternatifs « Réalisation du salon — coupe N » suivent le modèle déjà en place; aucune prestation ni prix n’a été inventé.
- La galerie compte donc huit réalisations, renumérotées de 01 à 08. Le `aria-label` de la piste annonce « Galerie de huit réalisations » et le compteur du visionneuse « 01 / 08 ».
- Contrôles exécutés (Chromium, préférence d’animation `off` préchargée) : huit cartes avec `data-image` de 0 à 7, huit photos réellement chargées (`naturalWidth` > 0; la dernière se charge dès qu’elle est visible, en raison du chargement différé), note « Certaines photos ne peuvent pas être affichées » masquée, visionneuse ouverte sur `08 / 08` puis bouclée sur `01 / 08` avec la flèche droite, fermeture par Échap, aucun débordement horizontal à 1280 et 390 px, aucune erreur de page ni requête d’image en échec.
- Build et vérification TypeScript réussis après le changement. Aucune publication, aucun DNS, domaine ou dépendance touchés.

## Bouton « Animations » retiré (01/10/2026)
- Demande du propriétaire : suppression du bouton de gestion des animations en bas de page.
- Retiré de `src/atelier/atelier-body.html` (bouton et mentions dans la fenêtre d'informations) et de `src/atelier/atelier-site.js` (préférence localStorage, clic, gestion `inert`). La prise en charge de « mouvement réduit » du système est conservée : `data-motion="off"` est appliqué automatiquement.
- Tests exécutés : build OK, typecheck OK, Playwright (1280×1800 et 390×844) — bouton absent, scène 3D prête, menu mobile ouvert/fermé, fenêtre d'informations sans mention « Animation », `data-motion="on"` / `"off"` selon préférence système.

## Section « Avis Google » ajoutée (01/10/2026)

- Demande du propriétaire : nouvelle section entre « Les coupes » et « Contact », reprenant exactement les quatre avis Google réels du salon et la mention « 5/5 sur Google ».
- `src/atelier/atelier-body.html` : section `#avis` insérée (kicker « AVIS GOOGLE » numéroté 04, titre « ILS EN PARLENT. », 5 étoiles bleues + mention « 5/5 sur Google », quatre `blockquote`/`cite` avec mention « AVIS GOOGLE », lien discret « Voir les avis sur Google » ouvrant une recherche Google Maps vers « La Barbe à Papa, Rue de Jace 189, 4101 Jemeppe-sur-Meuse, Belgique » dans un nouvel onglet). La numérotation de la section contact passe de 04 à 05.
- `src/atelier/atelier-reference.css` : styles de la section ajoutés en fin de fichier (grille 2 colonnes avec décalage éditorial en desktop, une colonne en mobile, textes en serif italique, séparateurs fins). La référence validée reste inchangée ; adaptation uniquement côté production.
- Avis repris mot pour mot ; aucune date, badge Local Guide, avatar ni note individuelle inventés. Avis statiques dans le code, aucune API ni dépendance ajoutée. Aucun prix, contenu existant, 3D ou galerie modifiés.
- Contrôles exécutés : build OK (2026-10-01T10:57:39Z) ; Playwright Chromium, préférence d'animation `off` préchargée, 1280×1800 et 390×844 — section présente, titre « ILS EN PARLENT. », 4 avis avec les bons noms, lien Google Maps correct, zéro débordement horizontal, galerie inchangée (8 cartes, compteur 01/08), zéro erreur de page, captures de la section desktop et mobile.
- Rien n'a été publié ; aucun DNS, domaine ou dépendance touchés.

## Test de réservation décembre 2026 — première étape (21/10/2026)

### Ajouts opérationnels et limites
- Ajout uniquement d’un CTA « Réserver un rendez-vous » sur le premier écran, vers `/reservation`, via une adaptation du rendu React et une feuille additive dédiée. Le HTML de production existant, la feuille de référence, les scripts WebGL/site, médias et sept tarifs de l’accueil n’ont pas été modifiés.
- Routes autonomes `/reservation`, `/admin`, `/reset-password`, chargées à la demande et stylées avec un module CSS indépendant.
- Lovable Cloud activé dans ce projet. Il s’agit actuellement d’une instance partagée aperçu/publication, pas d’un environnement de données de test distinct. Le site n’a pas été publié. Les fonctions Cloud et migrations ont été appliquées pour permettre les contrôles ; cela n’est pas une publication du site.
- Catalogue, horaires, réglages et coordonnées persistants ; tables privées sous RLS et permissions explicites. Les coordonnées sont séparées de l’agenda et du catalogue public. Disponibilité publique limitée aux heures libres.
- Validation serveur, fuseau Europe/Brussels, refus des dates hors décembre 2026 ; plage d’agenda protégée par exclusion GiST, commune aux rendez-vous et blocages confirmés. Prix et fin du rendez-vous recalculés côté serveur.
- Interface client : prestation, calendrier, heures libres, coordonnées, confidentialité et confirmation après insertion réelle. Les réservations sont désactivées jusqu’à validation par un administrateur des durées et de la confidentialité.
- Interface admin implémentée : authentification email/mot de passe, Google et Lovable, rôle vérifié via fonction serveur ; agenda jour/semaine, liste/détails, ajout manuel, blocages, annulation/libération, durées, horaires et activation. Récupération de mot de passe avec page dédiée ; aucune inscription email publique ni auto-attribution de rôle.
- Valeurs initiales indicatives : 30 / 45 / 15 / 30 / 60 / 60 / 30 minutes selon l’ordre actuel des sept prestations. Ne sont pas considérées comme validées.
- Aucun SMS ni email de rendez-vous configuré ; aucun envoi de confirmation prétendu. Les emails d’authentification sont des fonctions Cloud distinctes et leur livraison n’a pas été testée.
- Confidentialité : contact et conservation doivent être validés par le propriétaire. La valeur initiale de conservation proposée (90 jours) est un paramètre non validé, pas une politique confirmée. Suppression des coordonnées disponible à l’administrateur ; pas d’effacement automatique. L’avis RGPD complet/base juridique demeure à valider avant ouverture.
- Une seule capacité simultanée ; aucun collaborateur inventé. Pas de protection anti-abus/rate limiting dédiée à ce stade ; les contraintes empêchent le chevauchement, pas le spam de créneaux distincts. À traiter avant une ouverture publique.
- Le propriétaire a confirmé le 21/10/2026 à 12:31 UTC que les sept prestations/tarifs actuels de l’accueil font foi pour les réservations ; aucune autre prestation ajoutée et aucun tarif remplacé.

### Vérifications réellement exécutées
- `bun test tests/booking-rules.test.ts` : 5 tests réussis, 18 assertions (décembre uniquement, conversion 10 h Bruxelles → 09 h UTC, frontière de date belge, dates manuelles hors période, champs obligatoires et courriel facultatif).
- `python3 tests/booking-security.py` : contrôles hébergés en lecture seule réussis ; aucun rendez-vous/compte créé. Accès public sans données aux tables privées, actions privilégiées refusées, sept prix exacts, horaires mardi–samedi 10 h–19 h, refus serveur novembre/janvier, aucun créneau public quand désactivé.
- Fonction Cloud `booking-public` appelée avec entrées invalides : refus HTTP 400 observé.
- Contrainte d’exclusion vérifiée dans le catalogue PostgreSQL. Son comportement simultané réel n’a pas été exercé avec des insertions.
- Chromium 1280×1800 et 390×844 : CTA présent et cliquable, navigation réelle vers `/reservation`, sept prestations chargées depuis Cloud, choix d’une prestation, dates correctement désactivées à l’état initial, connexion admin affichée, aucun débordement horizontal sur réservation/admin, aucune erreur de page.
- Captures ordinateur/mobile enregistrées sous `/tmp/browser/booking/` et visualisées (accueil mobile, réservation mobile, connexion desktop).
- Accueil : huit cartes de galerie et instance WebGL constatées ; préférence système reduced-motion utilisée. La scène et ses fichiers ne sont pas modifiés.
- Compilation automatique après correction de l’emplacement des tests : `build OK` à 12:26:43 UTC. Aucun build/typecheck manuel lancé.
- Référence SHA-256 revérifiée : `38298705467a6ba69365211a3293327149529ec3a0e58852d11766c59285324b`.

### Bloquants et contrôles non exécutés
- Aucun utilisateur d’authentification n’existe encore. Aucun premier admin n’a été inventé ni auto-attribué. Connexion authentifiée, écriture/lecture via agenda, blocage, annulation et réglages n’ont donc pas été vérifiés de bout en bout.
- Aucune fausse réservation de test créée sur l’instance partagée. Confirmation UI après écriture et collision simultanée restent non vérifiées tant qu’un environnement de test isolé ou une procédure approuvée n’est pas disponible.
- Le propriétaire a confirmé : aucun profil ni compte client, uniquement les coordonnées nécessaires au rendez-vous ; compte sécurisé pour l’administrateur.
- Le linter a signalé les fonctions SECURITY DEFINER ; les droits anonymes des fonctions privées ont été explicitement retirés et leur refus testé. La disponibilité publique est intentionnellement SECURITY DEFINER et ne retourne que des heures libres. Les fonctions admin vérifient le rôle et la création publique exige un appel serveur.

### Mise en service en aperçu (sans publication)
1. Ouvrir `/admin` dans l’aperçu. Créer le compte propriétaire dans **Cloud → Users → Add user**, ou se connecter avec Google/Lovable pour créer son compte sans lui donner de droits.
2. Identifier le compte propriétaire et demander l’attribution du rôle admin par opération privilégiée. Ne jamais écrire ce rôle dans un profil, des métadonnées modifiables ou le navigateur.
3. Le catalogue est confirmé ; régler/valider les durées, horaires, contact RGPD et conservation, puis activer les réservations uniquement après ces validations.
4. Tester les écritures dans un environnement isolé ; la présente instance est partagée. Ni domaine ni DNS ne doivent être modifiés pour ce test.
5. Entrées : aperçu du projet + `/reservation`, `/admin`, `/reset-password`. Aucune publication nécessaire pour consulter ces pages.

## Bouton unique et contrôles complémentaires — 21/10/2026, 12:31 UTC
- Instruction explicite appliquée : les deux liens de `.hero-actions` sont remplacés au rendu par un seul lien **Réserver un rendez-vous**, `/reservation`, avec les classes exactes `button button-blue`. L’ajout voisin et sa feuille CSS ont été supprimés. La référence originale et le HTML source existant restent inchangés ; aucune navigation salon/prestations ailleurs dans la page modifiée.
- Chromium 1280×1800 et 390×844 : un seul lien dans `.hero-actions`, classe et cible exactes, couleur calculée `rgb(22, 75, 200)`, focus clavier visible de 3 px et navigation Entrée vers réservation. Position avant défilement : x64/y615,84 en desktop ; x24/y501,05 en mobile. Visible dans le premier écran aux deux tailles.
- Sept prestations réellement chargées depuis Cloud, calendrier décembre désactivé tant que les validations manquent, admin affiché uniquement comme formulaire de connexion sans session, page de récupération et aller-retour 404 → accueil vérifiés. Huit cartes galerie, sept tarifs et WebGL présents ; aucun débordement horizontal ni erreur de page.
- Captures actualisées : `/tmp/browser/booking-unique/`, desktop et mobile ; captures d’accueil visualisées. Le défilement temporaire du screenshot mobile provient du focus clavier, pas d’un changement de mise en page.
- Durcissement admin : horaires, durées et activation sont désormais enregistrés dans une seule transaction serveur via `admin_save_booking_settings`. Un échec annule tous les changements ; rôle admin vérifié avant toute modification. Aucun tarif n’est accepté par cette fonction.
- Contrôles relancés : cinq tests/18 assertions réussis ; tests hébergés de sécurité réussis, incluant le refus public de la nouvelle fonction de réglages ; compilation automatique `build OK` à 12:33:23 UTC.
- État confirmé par lecture Cloud : **0 compte, 0 administrateur, 0 rendez-vous**. Aucun faux compte ni rendez-vous écrit. Les tests authentifiés de l’agenda, de l’écriture réelle, de l’enregistrement des réglages et des collisions simultanées restent bloqués par l’absence du compte propriétaire et d’un environnement isolé ; ils ne sont pas présentés comme exécutés.
- Réservation publique toujours désactivée ; durées et confidentialité à valider. Aucune publication/déploiement du site ni modification du domaine/DNS.

## Correction ciblée du calendrier en démonstration — 21/10/2026
- `/reservation` permet désormais de sélectionner les jours ouverts de décembre 2026 après choix de la prestation, indépendamment de l’activation publique. Dimanches et lundis restent fermés selon les horaires actuels ; aucune date hors décembre n’est proposée.
- Mention explicite **Mode démonstration — aucune réservation réelle**. Après sélection : **Créneaux disponibles après ouverture des réservations**. Choix conservateur autorisé par le propriétaire : aucun horaire simulé, aucune disponibilité privée consultée en démonstration.
- Le bouton de confirmation reste désactivé ; un envoi forcé du formulaire est également refusé avant tout appel réseau. Les vrais créneaux sont lus auprès du serveur uniquement quand activation, validation des durées et validation de la confidentialité sont toutes présentes (comportement manuel admin inchangé).
- Aucun changement du backend, des permissions/RLS, de l’administration, de l’accueil, de son bouton bleu, du CSS ou des animations. Référence originale SHA-256 vérifiée : `38298705467a6ba69365211a3293327149529ec3a0e58852d11766c59285324b`.
- Tests automatisés persistants : `bun test tests/booking-rules.test.ts`, **9 tests réussis, 37 assertions**, incluant jours ouverts en démonstration, prestation obligatoire, dimanche/lundi fermés, décembre uniquement et toutes les combinaisons des trois conditions d’activation.
- Contrôles hébergés : `python3 tests/booking-security.py`, tous réussis ; tables privées inaccessibles publiquement, fonctions privilégiées refusées, tarifs et horaires inchangés, novembre/janvier refusés et aucun créneau serveur à l’état désactivé. Aucune écriture effectuée.
- Chromium via `/tmp/browser/booking-demo/check_calendar.py`, **1280×1800 et 390×844** : sélection du 1er et du 31 décembre, état des 31 jours vérifié, dimanches/lundis désactivés, confirmation désactivée et soumission forcée refusée ; **zéro requête de créneaux et zéro requête de création en démonstration**, aucun débordement horizontal ni erreur de page. Captures calendrier desktop/mobile et message mobile enregistrées et visualisées.
- Activation simulée exclusivement dans la réponse de réglages du navigateur : le parcours reprend une vraie requête serveur `booking_slots`. Le serveur réellement désactivé renvoie toujours zéro créneau ; aucun réglage ni rendez-vous modifié. Une réservation réelle après activation administrative n’a pas été testée et reste soumise aux bloquants précédents.
- Accueil vérifié aux deux tailles : un seul CTA vers `/reservation`, sept tarifs et huit réalisations conservés. Compilation automatique : **build OK à 12:51:56 UTC**, aucun build/typecheck manuel exécuté.
- Aperçu : https://id-preview--f33ac174-d6f3-4aab-8e29-b40dd8cce95b.lovable.app/reservation . Aucune publication, aucun déploiement du site ou des fonctions, aucun changement domaine/DNS.
