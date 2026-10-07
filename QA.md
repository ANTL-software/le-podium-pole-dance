# Contrôles de la préversion

Recette navigateur du 7 octobre 2026.

- `npm run verify` : build frontend et typage du module paiement serveur réussis.
- `npm audit` : zéro vulnérabilité après mise à jour de source-map-js.
- Vitrine, six onglets adhérent et planning admin : absence de débordement horizontal mesurée en 320×568, 390×844, 430×932, 768×1024, 1024×768, 1440×900 et 844×390.
- Réservation d’essai ouverte et soumise avec identité fictive ; réservation membre et liste d’attente testées. Accès démo conservé après rechargement, retour sur planning.
- Édition locale d’un intitulé admin répercutée dans le planning membre ; configuration réinitialisée après l’essai.
- Pas de flèches/plus natifs dans les sources TypeScript ; react-icons SVG utilisés.
- Première publication : commit 8a7b756, workflow 37644237105 réussi, site public chargé et images présentes. Valeurs calculées : bouton #f2b0d6, accent #1f9eb3, texte bouton #40352f.

Limites : tests de dimensions dans le navigateur, pas sur appareils physiques. Recette Safari iOS/Android, installation PWA et fonctionnement hors ligne à compléter avant livraison réelle. Aucun backend, paiement ou compte réel testé/activé.
