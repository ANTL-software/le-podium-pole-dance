export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OpeningPeriod {
  start: string;
  end: string;
}

export interface BookingService {
  id: string;
  label: string;
  durationMinutes: number;
  bufferAfterMinutes?: number;
  slotIntervalMinutes?: number;
  minimumNoticeMinutes?: number;
  maximumAdvanceDays?: number;
}

export interface BookingResource {
  id: string;
  label: string;
}

export interface BookingSetup {
  timezone: string;
  services: readonly BookingService[];
  resources: readonly BookingResource[];
  weeklyAvailability: Readonly<Partial<Record<IsoWeekday, readonly OpeningPeriod[]>>>;
  dateOverrides?: Readonly<Record<string, readonly OpeningPeriod[]>>;
}

export interface BookingSlot {
  startsAt: string;
  endsAt: string;
}

export interface BookingCustomerInput {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface CreateBookingInput {
  serviceId: string;
  resourceId: string;
  startsAt: string;
  customer: BookingCustomerInput;
}

export interface PublicBooking {
  id: string;
  serviceId: string;
  resourceId: string;
  startsAt: string;
  endsAt: string;
  customer: BookingCustomerInput;
}

export class BookingConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingConfigurationError";
  }
}

export class InvalidBookingRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBookingRequestError";
  }
}

export class BookingUnavailableError extends Error {
  constructor() {
    super("This booking slot is no longer available");
    this.name = "BookingUnavailableError";
  }
}
