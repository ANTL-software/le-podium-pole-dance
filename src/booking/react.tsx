import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BookingClientError, createBookingApiClient, defaultBookingDate, type BookingApiClient } from "./client.js";
import { createLocalBookingDemoClient, defaultLocalDemoDate, type LocalBookingDemoOptions } from "./demo.js";
import type { BookingSlot, PublicBooking } from "./types.js";

export interface BookingProviderEmbedProps {
  bookingUrl: string;
  title: string;
  mode?: "inline" | "link";
  linkLabel?: string;
  className?: string;
}

/** For static sites: the external provider owns availability and prevents duplicate reservations. */
export function BookingProviderEmbed(props: BookingProviderEmbedProps) {
  const mode = props.mode ?? "inline";
  const linkLabel = props.linkLabel ?? "Réserver un créneau";
  if (mode === "link") return <a className={props.className} href={props.bookingUrl}>{linkLabel}</a>;

  return <div className={props.className}>
    <iframe src={props.bookingUrl} title={props.title} loading="lazy" allow="payment" />
    <p><a href={props.bookingUrl}>{linkLabel}</a></p>
  </div>;
}

export interface BookingWidgetProps {
  title: string;
  serviceId: string;
  resourceId: string;
  api?: BookingApiClient;
  className?: string;
  initialDate?: string;
  locale?: string;
  timeZone?: string;
  onBooked?: (booking: PublicBooking) => void;
  successMessage?: string;
}

export function BookingWidget(props: BookingWidgetProps) {
  const api = useMemo(() => props.api ?? createBookingApiClient(), [props.api]);
  const [date, setDate] = useState(props.initialDate ?? defaultBookingDate(props.timeZone));
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setSelectedSlot(undefined);
    api.listAvailability({ serviceId: props.serviceId, resourceId: props.resourceId, date })
      .then((available) => {
        if (!active) return;
        setSlots(available);
        setStatus("idle");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Les créneaux ne sont pas disponibles.");
        setStatus("error");
      });
    return () => { active = false; };
  }, [api, date, props.resourceId, props.serviceId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) return;
    setStatus("saving");
    try {
      const booking = await api.createBooking({
        serviceId: props.serviceId,
        resourceId: props.resourceId,
        startsAt: selectedSlot,
        customer: { name, email, ...(phone.trim() ? { phone: phone.trim() } : {}) },
      });
      setStatus("success");
      setMessage(props.successMessage ?? "Votre créneau est confirmé. Un email de confirmation va vous être envoyé.");
      props.onBooked?.(booking);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "La réservation n’a pas pu être confirmée.");
      setStatus("error");
      if (error instanceof BookingClientError && error.status === 409) {
        api.listAvailability({ serviceId: props.serviceId, resourceId: props.resourceId, date })
          .then((available) => { setSlots(available); setSelectedSlot(undefined); })
          .catch(() => undefined);
      }
    }
  }

  const formatter = useMemo(() => new Intl.DateTimeFormat(props.locale ?? "fr-FR", {
    hour: "2-digit", minute: "2-digit", timeZone: props.timeZone,
  }), [props.locale, props.timeZone]);

  return <section className={props.className ?? "site-booking-widget"} aria-labelledby="booking-widget-title">
    <h2 id="booking-widget-title">{props.title}</h2>
    {status === "success" ? <p role="status">{message}</p> : <>
      <label>Date<input type="date" value={date} min={defaultBookingDate(props.timeZone)} onChange={(event) => setDate(event.target.value)} /></label>
      {status === "loading" ? <p aria-live="polite">Chargement des créneaux…</p> : null}
      {status === "error" ? <p role="alert">{message}</p> : null}
      {status === "idle" ? <div className="site-booking-widget__slots" aria-label="Créneaux disponibles">
        {slots.length === 0 ? <p>Aucun créneau n’est disponible ce jour.</p> : slots.map((slot) => <button type="button" key={slot.startsAt}
          className={selectedSlot === slot.startsAt ? "is-selected" : undefined}
          aria-pressed={selectedSlot === slot.startsAt} onClick={() => setSelectedSlot(slot.startsAt)}>
          {formatter.format(new Date(slot.startsAt))}
        </button>)}
      </div> : null}
      {selectedSlot ? <form onSubmit={submit}>
        <label>Nom<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Téléphone <span>(facultatif)</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
        <button type="submit" disabled={status === "saving"}>{status === "saving" ? "Confirmation…" : "Confirmer le rendez-vous"}</button>
      </form> : null}
    </>}
  </section>;
}



export interface BookingDemoProps extends LocalBookingDemoOptions {
  title: string;
  className?: string;
}

/** Local interactive demonstration for template showcases. It must be replaced by a provider or API before delivery. */
export function BookingDemo(props: BookingDemoProps) {
  const api = useMemo(() => createLocalBookingDemoClient(props), [
    props.durationMinutes, props.resourceId, props.serviceId, props.storageKey, props.timeZone,
  ]);
  return <BookingWidget
    title={props.title}
    serviceId={props.serviceId}
    resourceId={props.resourceId}
    timeZone={props.timeZone}
    {...(props.className === undefined ? {} : { className: props.className })}
    api={api}
    initialDate={defaultLocalDemoDate(props.timeZone)}
    successMessage="Démo enregistrée dans ce navigateur. Branchez un prestataire ou l’API antl avant livraison."
  />;
}
