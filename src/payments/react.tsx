import { useRef, useState, type ReactNode } from 'react';
import { startHostedCheckout } from './client.js';

export interface CheckoutButtonProps {
  offerId: string;
  children: ReactNode;
  endpoint?: string;
  className?: string;
  disabled?: boolean;
  onError?: (error: Error) => void;
}

export function CheckoutButton(props: CheckoutButtonProps) {
  const starting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    if (starting.current || props.disabled) return;
    starting.current = true;
    setPending(true);
    setError(false);

    try {
      await startHostedCheckout({
        offerId: props.offerId,
        ...(props.endpoint === undefined ? {} : { endpoint: props.endpoint }),
      });
    } catch (cause) {
      starting.current = false;
      setPending(false);
      setError(true);
      props.onError?.(cause instanceof Error ? cause : new Error('Checkout failed'));
    }
  }

  return (
    <>
      <button type="button" className={props.className} disabled={pending || props.disabled}
        aria-busy={pending} onClick={handleClick}>
        {props.children}
      </button>
      {error && <span role="alert">Le paiement n’a pas pu démarrer. Réessayez.</span>}
    </>
  );
}
