import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api";
import type { Destination } from "../data/destinations";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// A departure a few weeks out, so every booking has a believable date.
function nextDeparture(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + 21 + offsetDays);
  return date.toISOString().slice(0, 10);
}

type Props = { destination: Destination; index: number };

export default function DestinationCard({ destination, index }: Props) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function book() {
    setBusy(true);
    setError(null);
    try {
      await createBooking({
        destination: destination.name,
        country: destination.country,
        startDate: nextDeparture(index * 9),
        nights: destination.nights,
        travelers: 2,
        total: destination.pricePerPerson * 2,
      });
      navigate("/trips");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <div
        className="card-art"
        style={{
          background: `linear-gradient(135deg, ${destination.art[0]}, ${destination.art[1]})`,
        }}
      >
        <span className="card-code">{destination.code}</span>
        <span className="card-nights">{destination.nights} nights</span>
      </div>
      <div className="card-body">
        <p className="card-country">{destination.country}</p>
        <h3>{destination.name}</h3>
        <p className="card-tagline">{destination.tagline}</p>
        <div className="card-footer">
          <p className="price">
            {money.format(destination.pricePerPerson)}
            <span> / person</span>
          </p>
          <button className="btn" onClick={book} disabled={busy}>
            {busy ? "Booking…" : "Book"}
          </button>
        </div>
        {error && <p className="card-error">{error}</p>}
      </div>
    </article>
  );
}
