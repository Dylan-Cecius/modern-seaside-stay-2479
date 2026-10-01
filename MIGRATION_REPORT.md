# Rapport d’intégration — La Barbe à Papa

## Référence et restauration

- Source validée : `reference/La-Barbe-a-Papa-Apercu-valide.html`
- Taille : 360089 octets
- SHA-256 vérifié : `38298705467a6ba69365211a3293327149529ec3a0e58852d11766c59285324b`
- Point de restauration demandé : `52f0c2bcd8f42374c11d4937d831a37dda000ee5`
- Copie des fichiers remplacés : `reference/backup-52f0c2bcd8f42374c11d4937d831a37dda000ee5/`

## Intégration

- La route `/` sert le contenu, les styles et les deux scripts vanilla de la référence dans l’application React/Vite existante.
- Le renderer `window.AtelierScene` et l’instance `window.atelierScene` sont conservés.
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
- `src/atelier/atelier-body.html`
- `src/atelier/atelier-reference.css`
- `src/atelier/atelier-scene.js`
- `src/atelier/atelier-site.js`
- `public/robots.txt`
- `public/sitemap.xml`
- `reference/La-Barbe-a-Papa-Apercu-valide.html`
- `AGENTS.md`

## Vérifications effectuées

- Compilation automatique Vite : réussie.
- Vérification TypeScript avec `tsgo -p tsconfig.app.json --noEmit` : réussie.
- Chromium, bureau 1440 × 1000 : rendu comparé à la référence dans le même navigateur, animations désactivées.
- Chromium, mobile 390 × 844 : rendu comparé à la référence; menu ouvert et fermé avec Échap.
- Chromium, mobile 375 × 844 : aucun débordement horizontal.
- WebGL : renderer actif, 23744 triangles, compteur de rendu en progression.
- Pause/reprise : compteur de rendu arrêté après désactivation; préférence conservée après rechargement.
- Fallback sans WebGL : renderer `fallback` et image statique visibles.
- Galerie : cinq réalisations, flèches, ouverture du dialogue, navigation clavier et fermeture Échap vérifiées.
- Focus : placé sur les boutons de fermeture puis rendu aux déclencheurs pour les deux dialogues.
- Ancres : navigation vers `#prestations` vérifiée.
- Images : six éléments source chargés, six réussites.
- Console : aucune erreur runtime observée sur ordinateur ou mobile.
- Débordement horizontal : 0 px sur 1440, 390 et 375 px.
- Route inconnue : page 404 existante affichée.

## Points non validés automatiquement

- La pause lors d’un véritable changement d’onglet est conservée dans le code source validé, mais Chromium automatisé ne permet pas de simuler fidèlement un onglet système réellement masqué dans ce contrôle.
- Aucun test n’a été réalisé sur la version publiée, conformément à l’interdiction de publier à cette étape.
