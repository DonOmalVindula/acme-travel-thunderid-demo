# Acme Travel: adding ThunderID to an app, step by step

Acme Travel is a small React app with a bookings API. It starts with no sign-in at all: anyone
can see every trip and book one. [GUIDE.md](GUIDE.md) adds ThunderID to it in six steps, until
sign-in, self sign-up, a second factor, branding and API authorization are all in place. After
the first config file, the web app never changes again.

## What is in this repository

| Path | What it is |
|------|------------|
| `acme-travel-web/` | The React web app (Vite + TypeScript). Starts unsecured. Runs on http://localhost:3001 |
| `acme-bookings-api/` | The bookings API (Node + Express). Starts unsecured. Runs on http://localhost:4001 |
| `GUIDE.md` | The step-by-step integration guide |
| `solution/` | The finished, ThunderID-secured versions of every file that changes in the guide |
| `starter/` | A copy of the unsecured starting files |
| `scripts/apply-web.sh` | Wires the web app to ThunderID in one go, Step 1c of the guide (`pnpm apply-web`) |
| `scripts/apply-solution.sh` | Copies all of `solution/` over both apps (`pnpm apply-solution`) |
| `scripts/reset.sh` | Puts both apps back to the unsecured starting point (`pnpm reset`) |

## Branches and checkpoints

| Ref | What you get |
|-----|--------------|
| `main` (tag `checkpoint-0-start`) | The unsecured starting point. Follow GUIDE.md from here |
| `solution` branch, tag `step-1-sign-in` | Step 1 done: the web app signs in through ThunderID |
| `solution` branch, tag `step-5-protect-api` | Everything done: web app and API secured |

Jump to any of them with dependencies installed:

```bash
pnpm checkpoint start
pnpm checkpoint step-1-sign-in
pnpm checkpoint step-5-protect-api
```

The checkpoints do not contain a Client ID. Put yours in an untracked file once and every
checkpoint picks it up:

```bash
echo "VITE_THUNDERID_CLIENT_ID=<your Client ID>" > acme-travel-web/.env.local
```

Steps 2, 3, 4 and 6 of the guide change nothing in the code, so they have no checkpoint of
their own.

## Run the apps

Requires Node.js 22 or later and pnpm (`corepack enable` or `npm install -g pnpm`). This is one
pnpm workspace with both apps in it.

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts the bookings API and the web app together, each one's output prefixed with
its name. `pnpm dev:web` and `pnpm dev:api` start them one at a time.

Open http://localhost:3001. The web app proxies every `/api` call to the bookings API, so the
browser only ever talks to one origin.

Port 3001 is used on purpose, since 3000 is often taken. If you change it, change it in
`acme-travel-web/vite.config.ts` and in the application's redirect URI and allowed origin in the
ThunderID Console.

## Run ThunderID

Any of these gives you a ThunderID at https://localhost:8090:

```bash
npx thunderid
```

or download the release from https://github.com/thunder-id/thunderid/releases, unzip it and run:

```bash
./setup.sh --admin-password <choose one>
./start.sh
```

Console: https://localhost:8090/console (user `admin`). The certificate is self-signed, so accept
the browser warning once for https://localhost:8090 before signing in to the app.

Docs: https://thunderid.dev/docs
