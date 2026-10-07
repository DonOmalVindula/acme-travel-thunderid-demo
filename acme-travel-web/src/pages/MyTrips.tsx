import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listBookings, type Booking } from "../api";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyTrips() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listBookings()
      .then(setBookings)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  return (
    <>
      <section className="hero hero-compact">
        <p className="eyebrow">My trips</p>
        <h1>Your upcoming trips</h1>
        <p className="lead">Everything you have booked with Acme Travel.</p>
      </section>

      {error && (
        <div className="notice notice-error">
          <strong>Could not load your trips.</strong> {error}
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <div className="notice">
          No trips yet. <Link to="/">Explore destinations</Link> to book one.
        </div>
      )}

      {bookings && bookings.length > 0 && (
        <ul className="trips">
          {bookings.map((booking) => (
            <li key={booking.id} className="trip">
              <div>
                <p className="card-country">{booking.country}</p>
                <h3>{booking.destination}</h3>
                <p className="trip-meta">
                  {formatDate(booking.startDate)} · {booking.nights} nights ·{" "}
                  {booking.travelers} travelers
                </p>
              </div>
              <div className="trip-side">
                <span className={`pill pill-${booking.status}`}>
                  {booking.status}
                </span>
                <p className="price">{money.format(booking.total)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
