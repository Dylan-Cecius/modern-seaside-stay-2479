# Test de réservation décembre 2026

- [x] Corriger la sélection des jours ouverts en démonstration sans créneaux fictifs ni écriture ; tester activation, mobile/desktop et compilation automatique, actualiser le rapport.

- [x] Confirmer besoin de profils et liste de prestations — aucun profil client ; les sept prestations et tarifs actuels de l’accueil font foi.
- [x] Remplacer les deux actions hero par un seul bouton bleu Réserver un rendez-vous au même emplacement ; routes, clavier, mobile et sécurité vérifiés.
- [x] Rendre l’enregistrement des réglages atomique côté serveur ; vérifier le refus des appels publics.
- [x] Activer Cloud et préparer stockage privé, règles serveur et contrainte de réservation atomique.
- [x] Ajouter CTA isolé et parcours /reservation.
- [x] Ajouter connexion sécurisée et /admin avec agenda et réglages.
- [ ] Configurer le premier administrateur — attend création et identification du compte propriétaire, aucun compte présent.
- [x] Exécuter tests de règles et accès public, contrôles ordinateur/mobile et documenter les limites ; aucune publication.
- [x] Ajouter le réglage admin 15/30 min des départs de créneaux, enregistré atomiquement et validé côté serveur.
- [x] Ajouter l’anti-abus serveur des réservations publiques (3 créations/heure par empreinte d’IP ou de téléphone, contournement impossible côté client, admin non bloqué) et verrouiller les permissions des fonctions recréées.
- [x] Ajouter la purge manuelle journalisée des coordonnées expirées et la notice de confidentialité précise (base légale, droits, absence d’effacement automatique).
- [ ] Valider durées, confidentialité, contact RGPD et conservation par le propriétaire — aucune case cochée à sa place.
- [ ] Vérifier écritures/admin et collisions de bout en bout — attend compte admin et environnement de test isolé, instance Cloud actuellement partagée ; aucun faux rendez-vous en production.- [x] Agenda admin synchronisé automatiquement (temps réel + relecture de secours)
- [ ] Rôle admin : en attente de la confirmation du propriétaire sur le compte à autoriser (2 comptes présents)
- [ ] Confidentialité (contact, conservation) à valider par le propriétaire ; ouverture publique ensuite
