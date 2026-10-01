# Dernier contrôle de la migration

## Corrections
- Retirer complètement la feuille de style historique de l’application active et charger la feuille validée uniquement sur l’accueil.
- Donner à la page 404 une feuille minimale isolée, sans réintroduire le thème historique sur le salon.
- Restaurer dans le document principal la couleur de navigateur, le viewport et le favicon SVG bleu de la référence, tout en conservant les métadonnées factuelles.
- Rendre l’initialisation et le démontage de la scène et des interactions entièrement réversibles : événements, observateurs, animations, dialogues, canevas, instance et drapeaux.
- Respecter les ancres chargées directement, notamment `/#prestations`.

## Contrôles
- Vérifier les empreintes de la source, de la feuille CSS, du script WebGL et du PNG de secours.
- Comparer référence et application dans le même navigateur en 1440×1000 et 390×844, avec la préférence d’animation désactivée avant le chargement.
- Contrôler les styles calculés et pseudo-éléments de l’eyebrow, du titre, des tarifs et du contact, puis capturer les deux rendus.
- Refaire les contrôles compilation, TypeScript, menu, dialogues, mouvement, ancres et aller-retour accueil → 404 → accueil.
- Mettre à jour le rapport en séparant clairement les tests exécutés des comportements seulement conservés dans le code.

## Limites
- Aucun changement du design validé, du shader, de la géométrie, du contenu, des dépendances, du domaine ou d’un autre projet.
- Aucune publication.
