# Phase backend

Préversion publique sans données réelles. Les garde-fous de démonstration ne sont pas de la sécurité.

1. Authentification : sessions cookie HttpOnly/Secure, expiration, récupération, CSRF et consentements. Remplacer le drapeau local ; aucun secret ni jeton permanent dans localStorage.
2. Administration : rôle gérante contrôlé par API pour chaque opération, validation et audit. Masquer une route ne constitue pas une autorisation.
3. Cours collectifs : persistance, heure Europe/Paris, transactions atomiques capacité/crédits/doublons. Annulations validées, attente et notifications serveur, expiration des carnets.
4. Stripe : conserver le compte studio, valider Price IDs côté serveur, secrets hors Git/Vite, webhook signé/idempotent associé au membre authentifié. Créditer uniquement après paiement confirmé serveur, pas après redirection.
5. Le module exporté prépare les achats ponctuels de carnets ; les abonnements récurrents nécessitent un cycle serveur distinct (invoices, changements, annulations, échecs). Ne pas présenter le module ponctuel comme une gestion d’abonnement livrée.
6. Migration Wix : périmètre/consentements, import contrôlé, sauvegarde, rapprochement crédits et recette gérante. Aucune récupération de données réelles dans cette phase.
7. Exploitation : API/base, sauvegardes, monitoring, emails, mentions légales/RGPD, règles validées, tests multi-utilisateur, recette Safari iOS/Android et PWA hors ligne.

GitHub Pages héberge uniquement le frontend. Ne pas ajouter de réponses privées API ou de paiement au cache PWA.
