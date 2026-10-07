# Réservation — Le Podium

Module autonome `antl-site-booking` copié dans `src/booking/`. `BookingDemo` est strictement local, sans serveur. Le formulaire d’essai est indépendant des cours collectifs de l’espace adhérent.

Le planning collectif utilise `StudioDemoContext`, `useMemberAccount` et `src/types/member.ts`. Capacités et crédits sont simulés pour un compte fictif. Les navigateurs ne partagent pas l’état : ce n’est pas un moteur de disponibilité exploitable.

Phase backend : provider HTTP, authentification serveur, disponibilités en heure Europe/Paris, capacités/crédits protégés transactionnellement, annulations et attente persistées, confirmation après réponse serveur. Ne pas activer des réservations réelles sur GitHub Pages seul.
