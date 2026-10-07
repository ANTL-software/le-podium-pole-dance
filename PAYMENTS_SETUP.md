# Paiements du site

Les fichiers dans `src/payments` et `server/payments` appartiennent à ce projet. Le site utilise directement les clés du compte Stripe du client. Aucun service ni dépôt central n'intervient dans l'encaissement.

## Configuration

1. Installer `stripe` (`npm install stripe`) et les types Node (`npm install -D @types/node`) dans le projet. React est nécessaire uniquement si `src/payments/react.tsx` a été exporté.
2. Copier les noms de variables de `server/payments/env.payments.example` dans les secrets de l'hébergement. Garder `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` côté serveur exclusivement.
3. Renseigner le compte Stripe bénéficiaire dans `STRIPE_ACCOUNT_ID`. Le code vérifie que la clé secrète utilisée appartient à ce compte avant de créer un paiement.
4. Définir les offres dans `server/payments/config.ts`. Pour chaque offre, renseigner un prix Stripe ponctuel, son montant en plus petite unité monétaire et sa devise. Les valeurs déclarées sont comparées à Stripe avant le premier paiement de chaque instance serveur. Appeler `await payments.verify()` avant l'ouverture du site pour vérifier la configuration immédiatement.
5. Configurer `/api/checkout` et `/api/stripe-webhook` dans le serveur du site. Le webhook doit recevoir le corps brut et traiter `checkout.session.completed` ainsi que `checkout.session.async_payment_succeeded`.
6. L'action métier après paiement doit être durable et idempotente sur `session.id`. Tester en mode test avant de renseigner des clés et prix live.

Le navigateur n'envoie que l'identifiant d'offre ou un panier : par exemple `{ "lines": [{ "offerId": "principale", "quantity": 2 }] }`. Le serveur appelle `payments.create(offerId)` ou `payments.createCart(lines)` et renvoie `{ "url": session.url }`. Le bouton React facultatif est dans `src/payments/react.tsx` ; le client autonome est dans `src/payments/client.ts`.

Exemple de traitement webhook dans un serveur Express : monter cette route **avant** `express.json()`.

```ts
import express from 'express';
import { stripe, stripeWebhookSecret } from './server/payments/config.js';
import { InvalidWebhookSignatureError, processStripeWebhook } from './server/payments/server.js';

app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await processStripeWebhook({
      stripe,
      payload: req.body as Buffer,
      signature: req.header('stripe-signature') ?? '',
      webhookSecret: stripeWebhookSecret,
      onPaidOnce: fulfillPaidSession,
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(error instanceof InvalidWebhookSignatureError ? 400 : 500);
  }
});
```

`fulfillPaidSession` appartient au métier du site. Il doit enregistrer l'identifiant de session Stripe sous contrainte d'unicité et ne livrer la commande qu'une fois. Une page de succès ne remplace pas ce traitement.
