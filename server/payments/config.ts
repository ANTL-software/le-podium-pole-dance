import Stripe from 'stripe';
import { createMerchantCheckout, type MerchantSetup } from './server.js';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing payment configuration: ${name}`);
  return value;
}

function positiveInteger(name: string): number {
  const value = Number(required(name));
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Invalid payment amount: ${name}`);
  }
  return value;
}

function paymentMode(): MerchantSetup['mode'] {
  const value = required('PAYMENTS_MODE');
  if (value !== 'test' && value !== 'live') {
    throw new Error('PAYMENTS_MODE must be test or live');
  }
  return value;
}

// This file belongs to the client site. Add offers here and their matching env variables.
export const paymentSetup: MerchantSetup = {
  merchant: {
    name: required('PAYMENTS_MERCHANT_NAME'),
    stripeAccountId: required('STRIPE_ACCOUNT_ID'),
  },
  mode: paymentMode(),
  siteUrl: required('PUBLIC_SITE_URL'),
  offers: {
    principale: {
      priceId: required('STRIPE_PRICE_MAIN'),
      unitAmount: positiveInteger('STRIPE_PRICE_MAIN_AMOUNT_MINOR'),
      currency: required('STRIPE_PRICE_MAIN_CURRENCY').toLowerCase(),
    },
  },
};

export const stripe = new Stripe(required('STRIPE_SECRET_KEY'));
export const stripeWebhookSecret = required('STRIPE_WEBHOOK_SECRET');
export const payments = createMerchantCheckout(stripe, paymentSetup);
