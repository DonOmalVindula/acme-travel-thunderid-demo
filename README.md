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
| `solution/` | The finished, ThunderID-secured version of every file the guide changes. Copy from here as you go |
| `scripts/` | The helpers behind the `pnpm` commands named below |

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

## Work through the guide

1. With both apps and ThunderID running, follow [GUIDE.md](GUIDE.md) from the top.
2. When a step says to copy a file, take it from `solution/`. Your own edits stay in place.
3. Stuck, or short on time? `pnpm apply-web` finishes Step 1 for you, and `pnpm apply-solution`
   finishes everything, API included.
4. Want to start over? `pnpm reset` puts both apps back to the unsecured start.

These commands copy files in place. They never switch branches.

## Jump straight to a finished state

The same states also exist as git checkpoints, mainly so a presenter can switch quickly:
`checkpoint-0-start` is `main`, and `step-1-sign-in` and `step-5-protect-api` are on the
`solution` branch. Steps 2, 3, 4 and 6 change nothing in the code, so they have no checkpoint.

```bash
pnpm checkpoint start
pnpm checkpoint step-1-sign-in
pnpm checkpoint step-5-protect-api
```

A checkpoint discards local edits and reinstalls dependencies. No checkpoint contains a Client
ID. Put yours in an untracked file once and every state picks it up:

```bash
echo "VITE_THUNDERID_CLIENT_ID=<your Client ID>" > acme-travel-web/.env.local
```
