# Test de réservation — décembre 2026

## Périmètre strict
- Tout réaliser dans le projet actuel, uniquement en aperçu. Aucune publication du site ni modification du domaine ou des DNS.
- Préserver l’accueil, ses textes, tarifs, sections, médias, animations, scène WebGL et la référence originale. Seul ajout sur l’accueil : un lien très visible **Réserver un rendez-vous**, vers `/reservation`, en complément des actions existantes.
- Créer deux pages autonomes, dans la palette blanc nacré / bleu et avec des styles isolés : `/reservation` et `/admin`.

## Deux réponses nécessaires
1. Faut-il des profils utilisateurs (nom d’affichage, avatar, préférences…), en plus des coordonnées des clients enregistrées avec leurs rendez-vous ? Par défaut proposé : clients sans compte, administrateur avec compte sécurisé, sans table de profils.
2. La liste demandée pour les réservations diffère des tarifs actuellement affichés : elle ajoute **rasage crâne + barbe à l’ancienne — 30 €** et **shampoing — 2 €**, mais omet **Coupe + barbe à l’ancienne — 28 €** et **Double ancienne — 32 €**. Confirmer quelle liste utiliser sur la page de réservation ; les tarifs de l’accueil resteront intacts dans tous les cas.

## Parcours client
- Choix d’une prestation et, si confirmé, supplément shampoing.
- Calendrier limité à décembre 2026 ; disponibilités calculées à l’heure belge, par défaut du mardi au samedi de 10 h à 19 h.
- Prénom, nom et téléphone obligatoires ; courriel facultatif. Information de confidentialité et case d’accord requise.
- Confirmation affichée seulement après enregistrement réel ; message clair si le créneau vient d’être pris.
- Durées initiales indiquées comme **indicatives, à valider** ; réservations publiques désactivées initialement jusqu’à validation des durées et activation par l’administrateur.
- Aucune promesse de SMS ou d’email : ces envois ne seront pas ajoutés sans configuration réelle.

## Administration privée
- Connexion sécurisée, déconnexion et récupération du mot de passe avec page dédiée.
- Rôle administrateur contrôlé par le serveur ; aucun mot de passe, email autorisé ou rôle privilégié dans le code du navigateur.
- Agenda jour / semaine, liste et détails des rendez-vous, ajout manuel, annulation et blocage de plages.
- Réglages des horaires, durées et activation des réservations publiques.
- Première attribution du rôle admin uniquement par une opération privilégiée après identification du compte du propriétaire ; jamais par inscription publique ou auto-attribution.

## Étapes de réalisation
1. Activer Lovable Cloud, préparer le stockage sécurisé, les règles de décembre et les contrôles de réservation atomiques.
2. Construire le parcours client et le lien d’accueil, sans toucher aux éléments existants.
3. Construire l’administration et ses réglages ; documenter la création du premier compte admin.
4. Exécuter les vérifications disponibles, corriger les erreurs et produire le bilan. Si un accès administrateur manque, distinguer explicitement les tests exécutés et ceux bloqués.

## Détails techniques
- Conserver l’intégration React/Vite et le cycle de vie de l’Atelier ; modules et styles des nouvelles pages indépendants du CSS historique et du CSS de référence.
- Lovable Cloud fournit authentification, stockage et fonctions serveur. Aucun serveur persistant ajouté au projet.
- Séparer catalogue / réglages publics des coordonnées privées. RLS activée et droits explicites pour chaque table ; rôles dans une table dédiée.
- Disponibilité publique limitée à des heures libres, jamais à une liste de rendez-vous ou de clients.
- Dates stockées en `timestamptz`, calcul et présentation en `Europe/Brussels`. Refus serveur de toute réservation hors décembre 2026.
- Un agenda / une capacité simultanée par défaut, sans inventer des collaborateurs. Contrainte PostgreSQL d’exclusion des plages actives, partagée par rendez-vous et blocages : protection atomique contre les collisions, y compris simultanées.
- Validation des entrées au navigateur et au serveur ; durées et prix calculés à partir du catalogue serveur, jamais acceptés depuis le navigateur.
- Pas de nouvelle dépendance sauf celle rendue nécessaire par la connexion Cloud ; réutiliser les outils et contrôles existants.
- Ajouter des tests concrets pour décembre, heure belge, tarifs confirmés, horaires et accès administrateur. Vérifier aussi les collisions et l’absence d’accès public aux coordonnées.

## Vérifications et livraison
- Vérifier les résultats de compilation automatique ; exécuter les tests ciblés.
- Captures ordinateur et téléphone à 390 px : lien visible, parcours lisible, aucun débordement horizontal, accueil / galerie / WebGL inchangés.
- Exercer un enregistrement réel puis sa lecture dans l’administration uniquement dans un environnement de test isolé ; supprimer précisément les entrées de test, sans écrire de faux rendez-vous dans les données de production.
- Vérifier connexion, déconnexion, droits, agenda, ajout manuel, blocage, annulation et activation lorsque le compte admin est disponible.
- Mettre à jour `AGENTS.md` et `MIGRATION_REPORT.md` ; fournir les points d’entrée d’aperçu, fonctionnalités vérifiées, limites, réglages encore nécessaires et informations de confidentialité à compléter par le propriétaire.