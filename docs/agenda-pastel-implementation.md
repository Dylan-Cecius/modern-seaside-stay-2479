# Agenda pastel — La Barbe à Papa (décembre 2026)

## Référence visuelle validée
La maquette approuvée montre cinq colonnes mardi–samedi, la plage 10 h–19 h, un axe horaire fixe à gauche, des en-têtes pastel et des rendez-vous colorés positionnés verticalement. L'implémentation garde l'en-tête de /admin inchangé et remplace l'ancienne liste vide de la vue Agenda, sans toucher à / ni à /reservation.

## Fichiers
- src/booking/AdminPage.tsx : branchement du planning dans l'onglet Agenda ; les autres onglets, dialogues et la synchronisation restent en place.
- src/booking/AgendaTimeline.tsx : calendrier visuel avec navigation jour/semaine, compteur par colonne et cartes à cliquer pour voir le détail.
- src/booking/AgendaTimeline.module.css : styles isolés, aucune règle CSS globale ajoutée au site.
- src/booking/agendaTimelineUtils.ts : sélection des jours, heures en Europe/Brussels, couleurs et géométrie.
- tests/agenda-timeline.test.ts : 8 tests unitaires sans écriture en base.
- .github/workflows/agenda-pastel-checks.yml : typecheck, build, tests de règles existants et nouveaux.

## Géométrie
- Fuseau : Europe/Brussels, horodatages Supabase starts_at/ends_at au format absolu.
- Échelle : 72 px par heure, ligne horizontale toutes les 30 minutes.
- positionTop = (heureDébutMinutes – ouvertureGrilleMinutes) × 72 / 60.
- hauteur = (heureFinMinutes – heureDébutMinutes) × 72 / 60 – 3 px.
- Durées 15/30 min : carte compacte et nom lisible, détail entier en infobulle accessible et dans le volet détail au clic.
- Durées 45/60 min : carte à trois lignes (horaire, client, service) avec icône.
- Limites 10 h–19 h initialement ; la grille s'élargit lorsque les horaires de salon configurés sont plus étendus.
- Vue semaine : mardi–samedi de la semaine sélectionnée ; jour hors décembre marqué « Hors période test », sans rendez-vous affiché.
- Vue jour : colonne pleine largeur pour la date choisie.
- Flèches précédent/suivant ne sortent pas de décembre 2026.

## Couleurs
- Mar : #e4f0ff, mer : #eee8ff, jeu : #e4f8f2, ven : #fff0e6, sam : #ffedf1.
- Coupe homme : bleu glacier (#e3f1ff vers #d8eaff).
- Barbe : lilas pastel (#f0ebff vers #e8e1ff).
- Coupe + barbe : rose poudré (#ffe9ef vers #ffdde6).
- Coupe enfant : vert menthe (#e3faf1 vers #d3f6e9).
- Blocage : gris bleuté (#eff2f4 vers #e6eaee).
- Autres : pêche pastel (#fff1df vers #ffebd3).
- Police conservée : Arial pour le planning ; bleu d'identité #164bc8.

## Interactions
- Survol : élévation d'ombre discrète sans déplacement de la carte (ne casse pas la grille).
- Clavier : région du calendrier scrollable accessible au focus, boutons de rendez-vous avec nom accessible et focus 3 px.
- Responsive : mobile <500 px garde toutes les colonnes en défilement horizontal *interne* à la grille ; la page elle-même ne doit pas déborder.
- Données : booking_events confirmés, rendez-vous annulés exclus de la grille mais conservés dans Liste ; booking_customers soumis aux RLS admin.
- Aucune réservation fictive : une journée libre garde sa grille et affiche seulement un texte discret.
- Les événements déjà enregistrés restent visibles même si la journée a été ensuite fermée dans les réglages.
- Clic sur une carte ouvre le panneau Détails existant.
- Synchro Realtime plus repli 20 s : code et sécurité déjà présents réutilisés.

## Publication et validation
Cette intégration ne modifie ni les tarifs, ni les durées, ni les paramètres d'ouverture des réservations publiques. Une fusion GitHub ne correspond pas à une demande explicite de publication du site live ; la publication finale est une étape distincte dans Lovable. La maquette générée contient des noms d'exemple qui **ne sont pas** des rendez-vous dans l'agenda réel.
