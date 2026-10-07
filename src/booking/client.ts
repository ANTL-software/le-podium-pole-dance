import type { BookingCustomerInput, BookingSlot, CreateBookingInput, PublicBooking } from "./types.js";

export class BookingClientError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BookingClientError";
    this.status = status;
  }
}

export interface BookingApiClient {
  listAvailability(input: { serviceId: string; resourceId: string; date: string }): Promise<BookingSlot[]>;
  createBooking(input: CreateBookingInput): Promise<PublicBooking>;
}

export function createBookingApiClient(endpoint = "/api/booking", fetcher: typeof fetch = fetch): BookingApiClient {
  async function listAvailability(input: { serviceId: string; resourceId: string; date: string }): Promise<BookingSlot[]> {
    const url = new URL(`${endpoint.replace(/\/$/, "")}/availability`, window.location.origin);
    url.searchParams.set("serviceId", input.serviceId);
    url.searchParams.set("resourceId", input.resourceId);
    url.searchParams.set("date", input.date);
    const response = await fetcher(url, { credentials: "same-origin" });
    const payload: unknown = await response.json();
    if (!response.ok || !isSlotsPayload(payload)) throw new BookingClientError("Les créneaux ne sont pas disponibles pour le moment.", response.status);
    return payload.slots;
  }

  async function createBooking(input: CreateBookingInput): Promise<PublicBooking> {
    const response = await fetcher(`${endpoint.replace(/\/$/, "")}/reservations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(input),
    });
    const payload: unknown = await response.json();
    if (!response.ok || !isBookingPayload(payload)) {
      const message = isErrorPayload(payload) ? payload.error : "La réservation n’a pas pu être confirmée.";
      throw new BookingClientError(message, response.status);
    }
    return payload.booking;
  }

  return { listAvailability, createBooking };
}

export function defaultBookingDate(timeZone?: string): string {
  if (!timeZone) return new Date().toISOString().slice(0, 10);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts();
  const part = (type: Intl.DateTimeFormatPartTypes): string => parts.find((candidate) => candidate.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function toBookingInput(
  serviceId: string,
  resourceId: string,
  startsAt: string,
  customer: BookingCustomerInput,
): CreateBookingInput {
  return { serviceId, resourceId, startsAt, customer };
}

function isSlotsPayload(value: unknown): value is { slots: BookingSlot[] } {
  return typeof value === "object" && value !== null && "slots" in value && Array.isArray(value.slots) &&
    value.slots.every((slot) => typeof slot === "object" && slot !== null &&
      "startsAt" in slot && typeof slot.startsAt === "string" && "endsAt" in slot && typeof slot.endsAt === "string");
}

function isBookingPayload(value: unknown): value is { booking: PublicBooking } {
  return typeof value === "object" && value !== null && "booking" in value &&
    typeof value.booking === "object" && value.booking !== null && "id" in value.booking && typeof value.booking.id === "string";
}

function isErrorPayload(value: unknown): value is { error: string } {
  return typeof value === "object" && value !== null && "error" in value && typeof value.error === "string";
}
