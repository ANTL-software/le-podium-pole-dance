export interface CheckoutLineInput {
  offerId: string;
  quantity: number;
}

export type StartCheckoutInput = {
  endpoint?: string;
  fetcher?: typeof fetch;
  navigate?: (url: string) => void;
} & (
  | { offerId: string; lines?: never }
  | { lines: readonly CheckoutLineInput[]; offerId?: never }
);

export class CheckoutStartError extends Error {
  constructor(message = 'Le paiement n’a pas pu démarrer.') {
    super(message);
    this.name = 'CheckoutStartError';
  }
}

export async function startHostedCheckout(input: StartCheckoutInput): Promise<void> {
  const body = "offerId" in input
    ? { offerId: input.offerId }
    : { lines: input.lines };
  const response = await (input.fetcher ?? fetch)(input.endpoint ?? '/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new CheckoutStartError();
  }

  const result: unknown = await response.json();
  if (typeof result !== 'object' || result === null ||
      !('url' in result) || typeof result.url !== 'string') {
    throw new CheckoutStartError();
  }

  let url: URL;
  try {
    url = new URL(result.url);
  } catch {
    throw new CheckoutStartError();
  }

  if (url.protocol !== 'https:') {
    throw new CheckoutStartError();
  }

  (input.navigate ?? ((target: string) => window.location.assign(target)))(url.toString());
}
