import type Stripe from 'stripe';

export type OfferCatalog = Readonly<Record<string, string>>;

/** A browser-supplied selection. Prices are always resolved from the server catalogue. */
export interface CheckoutLine {
  offerId: string;
  quantity: number;
}

export interface MerchantOffer {
  priceId: string;
  unitAmount: number;
  currency: string;
}

export interface MerchantSetup {
  merchant: {
    name: string;
    stripeAccountId: string;
  };
  mode: 'test' | 'live';
  siteUrl: string;
  offers: Readonly<Record<string, MerchantOffer>>;
  successPath?: string;
  cancelPath?: string;
  automaticTax?: boolean;
}

export class MerchantConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MerchantConfigurationError';
  }
}

/** Checks the account selected by the server key and every configured Stripe Price. */
export async function verifyMerchantSetup(stripe: Stripe, setup: MerchantSetup): Promise<void> {
  if (!setup.merchant.name.trim() || !setup.merchant.stripeAccountId.startsWith('acct_')) {
    throw new MerchantConfigurationError('Merchant name and Stripe account ID are required');
  }

  const entries = Object.entries(setup.offers);
  if (entries.length === 0) {
    throw new MerchantConfigurationError('Configure at least one offer');
  }

  const account = await stripe.accounts.retrieveCurrent();
  if (account.id !== setup.merchant.stripeAccountId) {
    throw new MerchantConfigurationError('The Stripe key belongs to another merchant account');
  }

  for (const [offerId, offer] of entries) {
    if (!offerId.trim() || !offer.priceId.startsWith('price_') ||
        !Number.isSafeInteger(offer.unitAmount) || offer.unitAmount <= 0 ||
        !/^[a-z]{3}$/.test(offer.currency)) {
      throw new MerchantConfigurationError(`Invalid configuration for offer ${offerId}`);
    }

    const price = await stripe.prices.retrieve(offer.priceId);
    if (price.id !== offer.priceId || !price.active || price.type !== 'one_time' ||
        price.unit_amount !== offer.unitAmount || price.currency !== offer.currency ||
        price.livemode !== (setup.mode === 'live')) {
      throw new MerchantConfigurationError(`Stripe Price does not match offer ${offerId}`);
    }
  }
}

export function createMerchantCheckout(stripe: Stripe, setup: MerchantSetup) {
  let verified: Promise<void> | undefined;

  function verify(): Promise<void> {
    if (!verified) {
      verified = verifyMerchantSetup(stripe, setup).catch((error: unknown) => {
        verified = undefined;
        throw error;
      });
    }
    return verified;
  }

  async function create(offerId: string, referenceId?: string): Promise<CheckoutSessionResult> {
    if (!Object.hasOwn(setup.offers, offerId)) {
      throw new UnknownOfferError();
    }
    await verify();
    const offers = Object.fromEntries(
      Object.entries(setup.offers).map(([id, offer]) => [id, offer.priceId]),
    );
    return createHostedCheckoutSession({
      stripe,
      offers,
      offerId,
      siteUrl: setup.siteUrl,
      ...(setup.successPath === undefined ? {} : { successPath: setup.successPath }),
      ...(setup.cancelPath === undefined ? {} : { cancelPath: setup.cancelPath }),
      ...(setup.automaticTax === undefined ? {} : { automaticTax: setup.automaticTax }),
      ...(referenceId === undefined ? {} : { referenceId }),
    });
  }

  async function createCart(lines: readonly CheckoutLine[], referenceId?: string): Promise<CheckoutSessionResult> {
    await verify();
    const offers = Object.fromEntries(
      Object.entries(setup.offers).map(([id, offer]) => [id, offer.priceId]),
    );
    return createHostedCartCheckoutSession({
      stripe,
      offers,
      lines,
      siteUrl: setup.siteUrl,
      ...(setup.successPath === undefined ? {} : { successPath: setup.successPath }),
      ...(setup.cancelPath === undefined ? {} : { cancelPath: setup.cancelPath }),
      ...(setup.automaticTax === undefined ? {} : { automaticTax: setup.automaticTax }),
      ...(referenceId === undefined ? {} : { referenceId }),
    });
  }

  return { verify, create, createCart };
}

export interface CreateCheckoutInput {
  stripe: Stripe;
  offers: OfferCatalog;
  offerId: string;
  siteUrl: string;
  successPath?: string;
  cancelPath?: string;
  referenceId?: string;
  automaticTax?: boolean;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export class UnknownOfferError extends Error {
  constructor() {
    super('Unknown checkout offer');
    this.name = 'UnknownOfferError';
  }
}

export class InvalidWebhookSignatureError extends Error {
  constructor() {
    super('Invalid Stripe webhook signature');
    this.name = 'InvalidWebhookSignatureError';
  }
}

function siteOrigin(siteUrl: string): URL {
  const url = new URL(siteUrl);
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if ((url.protocol !== 'https:' && !(isLocal && url.protocol === 'http:')) ||
      url.username || url.password || url.search || url.hash) {
    throw new Error('siteUrl must be an HTTPS site URL or a local HTTP URL');
  }

  return url;
}

function sitePath(path: string, origin: URL): URL {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('Checkout return paths must start with a single slash');
  }

  const url = new URL(path, origin);
  if (url.origin !== origin.origin || url.hash) {
    throw new Error('Checkout return paths must stay on the site origin');
  }

  return url;
}

async function createHostedCheckoutSession(input: CreateCheckoutInput): Promise<CheckoutSessionResult> {
  const priceId = Object.hasOwn(input.offers, input.offerId)
    ? input.offers[input.offerId]
    : undefined;

  if (typeof priceId !== 'string' || !priceId.startsWith('price_')) {
    throw new UnknownOfferError();
  }

  return createStripeCheckoutSession(input, [{ price: priceId, quantity: 1 }], input.offerId);
}

export interface CreateCartCheckoutInput {
  stripe: Stripe;
  offers: OfferCatalog;
  lines: readonly CheckoutLine[];
  siteUrl: string;
  successPath?: string;
  cancelPath?: string;
  referenceId?: string;
  automaticTax?: boolean;
}

/** Creates a hosted Checkout session for a validated multi-product basket. */
export async function createHostedCartCheckoutSession(input: CreateCartCheckoutInput): Promise<CheckoutSessionResult> {
  if (input.lines.length === 0) {
    throw new UnknownOfferError();
  }

  const quantities = new Map<string, { price: string; quantity: number }>();
  for (const line of input.lines) {
    if (!line.offerId.trim() || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
      throw new UnknownOfferError();
    }
    const priceId = Object.hasOwn(input.offers, line.offerId) ? input.offers[line.offerId] : undefined;
    if (typeof priceId !== "string" || !priceId.startsWith("price_")) {
      throw new UnknownOfferError();
    }
    const existing = quantities.get(line.offerId);
    const quantity = (existing?.quantity ?? 0) + line.quantity;
    if (quantity > 99) throw new UnknownOfferError();
    quantities.set(line.offerId, { price: priceId, quantity });
  }

  const lineItems = Array.from(quantities.values());
  return createStripeCheckoutSession(input, lineItems, Array.from(quantities.keys()).join(","));
}

interface CheckoutSessionConfiguration {
  stripe: Stripe;
  siteUrl: string;
  successPath?: string;
  cancelPath?: string;
  referenceId?: string;
  automaticTax?: boolean;
}

async function createStripeCheckoutSession(
  input: CheckoutSessionConfiguration,
  lineItems: { price: string; quantity: number }[],
  offerMetadata: string,
): Promise<CheckoutSessionResult> {
  const origin = siteOrigin(input.siteUrl);
  const successUrl = sitePath(input.successPath ?? '/paiement/succes', origin);
  const cancelUrl = sitePath(input.cancelPath ?? '/paiement/annule', origin);
  successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
  const success = successUrl.toString().replace('%7BCHECKOUT_SESSION_ID%7D', '{CHECKOUT_SESSION_ID}');

  if (input.referenceId !== undefined && (input.referenceId.length === 0 || input.referenceId.length > 200)) {
    throw new Error('referenceId must contain between 1 and 200 characters');
  }

  const session = await input.stripe.checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'hosted',
    line_items: lineItems,
    success_url: success,
    cancel_url: cancelUrl.toString(),
    ...(input.referenceId === undefined ? {} : { client_reference_id: input.referenceId }),
    ...(input.automaticTax === undefined ? {} : { automatic_tax: { enabled: input.automaticTax } }),
    metadata: { offer_ids: offerMetadata },
  });

  if (!session.url) {
    throw new Error('Stripe did not return a Checkout URL');
  }

  return { sessionId: session.id, url: session.url };
}

export interface ProcessWebhookInput {
  stripe: Stripe;
  payload: Buffer | string;
  signature: string;
  webhookSecret: string;
  /** Must durably record the session and perform fulfillment at most once per session.id. */
  onPaidOnce: (session: Stripe.Checkout.Session) => Promise<void>;
}

export type WebhookOutcome = 'ignored' | 'paid';

export async function processStripeWebhook(input: ProcessWebhookInput): Promise<WebhookOutcome> {
  let event: Stripe.Event;
  try {
    event = input.stripe.webhooks.constructEvent(
      input.payload,
      input.signature,
      input.webhookSecret,
    );
  } catch {
    throw new InvalidWebhookSignatureError();
  }

  if (event.type !== 'checkout.session.completed' &&
      event.type !== 'checkout.session.async_payment_succeeded') {
    return 'ignored';
  }

  const object = event.data.object;
  if (object.object !== 'checkout.session') {
    return 'ignored';
  }

  const session = object as Stripe.Checkout.Session;
  if (session.mode !== 'payment' || session.payment_status !== 'paid') {
    return 'ignored';
  }

  await input.onPaidOnce(session);
  return 'paid';
}
