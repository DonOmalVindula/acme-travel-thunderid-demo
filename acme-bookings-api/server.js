import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT ?? 4001);

// In-memory store: restarting the API resets the demo data.
const bookings = [
  {
    id: randomUUID(),
    destination: "Lisbon",
    country: "Portugal",
    startDate: "2026-11-02",
    nights: 4,
    travelers: 2,
    status: "confirmed",
    total: 1280,
  },
  {
    id: randomUUID(),
    destination: "Kyoto",
    country: "Japan",
    startDate: "2027-03-18",
    nights: 6,
    travelers: 2,
    status: "confirmed",
    total: 2960,
  },
];

const app = express();
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { destination, country, startDate, nights, travelers, total } = req.body ?? {};
  if (!destination || !startDate || !nights) {
    res.status(400).json({ error: "destination, startDate and nights are required" });
    return;
  }
  const booking = {
    id: randomUUID(),
    destination,
    country: country ?? "",
    startDate,
    nights: Number(nights),
    travelers: Number(travelers ?? 1),
    status: "pending",
    total: Number(total ?? 0),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.listen(PORT, () => {
  console.log(`Acme bookings API listening on http://localhost:${PORT}`);
});
