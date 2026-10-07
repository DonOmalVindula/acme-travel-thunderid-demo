import cors from "cors";
import express from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT ?? 4001);

// Where ThunderID runs, and the identifier of this API's resource server in the Console.
const THUNDERID_BASE_URL = process.env.THUNDERID_BASE_URL ?? "https://localhost:8090";
const API_AUDIENCE = process.env.API_AUDIENCE ?? "https://api.acme.example/bookings";

// ThunderID publishes its signing keys here. jose caches them and refreshes on rotation.
const jwks = createRemoteJWKSet(new URL(`${THUNDERID_BASE_URL}/oauth2/jwks`));

// Checks the signature, issuer, audience and expiry of the bearer token.
async function requireToken(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Sign in to use the bookings API" });
    return;
  }
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: THUNDERID_BASE_URL,
      audience: API_AUDIENCE,
    });
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: `Invalid token: ${error.message}` });
  }
}

// Checks that the token carries a permission, such as booking:read.
function requireScope(scope) {
  return (req, res, next) => {
    const granted = String(req.user?.scope ?? "").split(" ");
    if (!granted.includes(scope)) {
      res.status(403).json({ error: `Forbidden: this action needs the ${scope} permission` });
      return;
    }
    next();
  };
}

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

app.get("/api/bookings", requireToken, requireScope("booking:read"), (_req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", requireToken, requireScope("booking:write"), (req, res) => {
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
  console.log(`Accepting tokens from ${THUNDERID_BASE_URL} for audience ${API_AUDIENCE}`);
});
