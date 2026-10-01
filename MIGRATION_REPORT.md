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
