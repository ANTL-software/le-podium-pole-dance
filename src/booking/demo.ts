import { Temporal } from "@js-temporal/polyfill";
import type { BookingApiClient } from "./client.js";
import type { BookingSlot, CreateBookingInput, PublicBooking } from "./types.js";

export interface LocalBookingDemoOptions {
  serviceId: string;
  resourceId: string;
  timeZone: string;
  durationMinutes?: number;
  storageKey?: string;
}

type StoredBooking = { startsAt: string; resourceId: string };

/**
 * Browser-only showcase client. It stores bookings in this browser so a template
 * can demonstrate the interface without a provider or backend. Never use it in a client delivery.
 */
export function createLocalBookingDemoClient(options: LocalBookingDemoOptions): BookingApiClient {
  const durationMinutes = options.durationMinutes ?? 60;
  const storageKey = options.storageKey ?? "antl-site-booking-demo";

  function readStoredBookings(): StoredBooking[] {
    if (typeof window === "undefined") return [];
    try {
      const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
      return Array.isArray(value) ? value.filter(isStoredBooking) : [];
    } catch {
      return [];
    }
  }

  function saveStoredBookings(bookings: readonly StoredBooking[]): void {
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(bookings));
  }

  return {
    async listAvailability(input) {
      validateDemoRequest(input, options);
      const occupied = new Set(readStoredBookings().filter((booking) => booking.resourceId === input.resourceId).map((booking) => booking.startsAt));
      return createDemoSlots(input.date, options.timeZone, durationMinutes).filter((slot) => !occupied.has(slot.startsAt));
    },
    async createBooking(input: CreateBookingInput) {
      validateDemoRequest(input, options);
      if (!input.customer.name.trim() || !input.customer.email.trim()) throw new Error("Renseignez votre nom et votre email.");
      const available = await this.listAvailability({ serviceId: input.serviceId, resourceId: input.resourceId, date: localDate(input.startsAt, options.timeZone) });
      const slot = available.find((candidate) => candidate.startsAt === input.startsAt);
      if (!slot) throw new Error("Ce créneau vient d’être réservé. Choisissez-en un autre.");
      saveStoredBookings([...readStoredBookings(), { startsAt: slot.startsAt, resourceId: input.resourceId }]);
      return {
        id: createDemoId(), serviceId: input.serviceId, resourceId: input.resourceId,
        startsAt: slot.startsAt, endsAt: slot.endsAt,
        customer: { ...input.customer, name: input.customer.name.trim(), email: input.customer.email.trim() },
      };
    },
  };
}

export function defaultLocalDemoDate(timeZone: string): string {
  return Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate().add({ days: 1 }).toString();
}

function createDemoSlots(dateValue: string, timeZone: string, durationMinutes: number): BookingSlot[] {
  const date = Temporal.PlainDate.from(dateValue);
  return ["10:00", "14:00", "18:00"].map((time) => {
    const startsAt = date.toPlainDateTime(Temporal.PlainTime.from(time)).toZonedDateTime(timeZone).toInstant();
    return {
      startsAt: startsAt.toString(),
      endsAt: startsAt.add({ minutes: durationMinutes }).toString(),
    };
  });
}

function validateDemoRequest(input: { serviceId: string; resourceId: string }, options: LocalBookingDemoOptions): void {
  if (input.serviceId !== options.serviceId || input.resourceId !== options.resourceId) throw new Error("Configuration de démonstration invalide.");
}

function localDate(instant: string, timeZone: string): string {
  return Temporal.Instant.from(instant).toZonedDateTimeISO(timeZone).toPlainDate().toString();
}

function isStoredBooking(value: unknown): value is StoredBooking {
  return typeof value === "object" && value !== null && "startsAt" in value && "resourceId" in value &&
    typeof value.startsAt === "string" && typeof value.resourceId === "string";
}

function createDemoId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
