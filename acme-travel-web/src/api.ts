// Every call to the Acme bookings API goes through here.
// The dev server proxies /api to http://localhost:4001 (see vite.config.ts).

export type Booking = {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  nights: number;
  travelers: number;
  status: "confirmed" | "pending";
  total: number;
};

export type NewBooking = Omit<Booking, "id" | "status">;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.error ?? response.statusText);
  }
  return response.json() as Promise<T>;
}

export function listBookings(): Promise<Booking[]> {
  return request<Booking[]>("/bookings");
}

export function createBooking(booking: NewBooking): Promise<Booking> {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });
}
