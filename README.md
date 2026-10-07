# Le Podium Pole Dance

Préversion du site client, copie indépendante du template 02, sans fork ni historique du template. React, Vite, TypeScript strict, SCSS et react-icons. Logo conservé, identité beige lumineuse, accents rose `#f2b0d6` et bleu `#1f9eb3`.

## Démarrer et vérifier

```sh
npm ci
npm run dev
npm run verify
```

GitHub Pages : https://antl-software.github.io/le-podium-pole-dance/ ; `main` déclenche la vérification et publication. Routage par hash sans serveur de réécriture. Vite utilise `/le-podium-pole-dance/` ; adapter `base` pour un domaine propre.

## Modifier simplement

- `src/content/danceStudio.ts` : identité, textes, liens, images/cadrages, palette et ordre des sections. `enabled: false` masque une section. Palette partagée par toutes les routes.
- `src/content/podium.ts` : FAQ, coordonnées et informations pratiques.
- `src/content/member.ts` : compte fictif, carnets, calendrier initial et règles de démo.
- `src/views/components/` et `src/views/layouts/` : vues ; `src/hooks/` et `src/contexts/` : état/actions typés ; `src/types/` : contrats.
- `src/utils/styles/podium.scss` : composition responsive et variables complémentaires ; mixins du template conservés.

## Parcours

- Vitrine single page avec CTA fréquents et formulaire `BookingDemo`.
- `#/connexion` : accès fictif sans mot de passe. Préférence locale persistante ; `#/account` ouvre directement le planning.
- `#/account` : planning, réservations/annulations, attente, carnets/crédits, factures fictives et profil démo.
- `#/admin` : maquette publique du planning, capacités, prestations et carnets. Les changements locaux alimentent vitrine/planning.
- `#/confidentialite` : fonctionnement et stockage local.

**Aucune authentification réelle ni administration sécurisée. Aucun paiement, email ou réservation réelle. Ne pas saisir de données personnelles.** localStorage isolé du template 02. Formulaire d’essai et compte fictif : deux scénarios indépendants. Réinitialisations disponibles dans leurs interfaces.

## Installation et phase suivante

Manifest, cache du shell public et aide à l’installation inclus. HTTPS/navigateur compatible nécessaires. Safari iOS : Partager puis Sur l’écran d’accueil. Recette physique iOS/Android avant livraison ; la PWA ne sécurise pas la maquette.

Modules autonomes `antl-site-booking` et `antl-site-payments` présents sans runtime antl central. Stripe serveur uniquement, non activé dans l’interface. Voir [BACKEND_ROADMAP.md](BACKEND_ROADMAP.md), [BOOKING_SETUP.md](BOOKING_SETUP.md) et [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md).

Photos studio à fournir ; [ART_DIRECTION.md](ART_DIRECTION.md) décrit les visuels provisoires. Horaires, tarifs et adresse à valider avec la gérante avant production.
