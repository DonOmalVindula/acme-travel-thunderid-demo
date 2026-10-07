# From unsecured to secured: the step-by-step guide

Steps marked **Console only** change nothing in the app's code. That is the point.

Prerequisites:

- ThunderID running at https://localhost:8090, certificate accepted in your browser (see README.md).
- Both apps running with `pnpm dev`. The web app is on http://localhost:3001.
- For Step 3, a way to receive email: ThunderID's development mail setup, or your own SMTP
  settings under System in the Console.

If a step goes wrong, `pnpm apply-solution` jumps to the finished state and `pnpm reset` goes
back to the start. The same states also exist as git checkpoints: `pnpm checkpoint start`,
`pnpm checkpoint step-1-sign-in`, `pnpm checkpoint step-5-protect-api` (see README.md).

## Step 0: the unsecured app

Open http://localhost:3001. Explore shows six trips. Click **Book** on one and it appears under
**My trips**. Nobody signed in, nobody was asked who they are, and the API at
http://localhost:4001/api/bookings answers anyone who asks.

## Step 1: Customers sign in

### 1a. Register the app (Console)

Applications, Add Application, **React**.

| Wizard step | Value |
|-------------|-------|
| Name | `Acme Travel Web` |
| Security | keep **Username & Password** |
| Experience | keep the default theme |
| Authorized redirect URIs | `http://localhost:3001` |
| Use the same URLs for post-logout redirect | keep ticked |
| CORS allowed origins | `http://localhost:3001` |

Finish, then copy the **Client ID** from the Overview tab.

### 1b. Create Alice (Console)

Users, Add User, **Create User**: username `alice`, email `alice@acme.example`, first name
`Alice`, last name `Traveler`, and a password.

### 1c. Wire the SDK into the web app (code)

```bash
pnpm --filter acme-travel-web add @thunderid/react
```

1. Create `acme-travel-web/public/runtime.json`. It is the only place that knows where
   ThunderID is:

   ```json
   {
     "clientId": "<the Client ID from the Console>",
     "baseUrl": "https://localhost:8090",
     "scopes": ["openid", "profile"]
   }
   ```

2. Add `src/config.ts`, which reads that file. Copy it from `solution/acme-travel-web/src/config.ts`.

3. `src/main.tsx`: wrap the app in `ThunderIDProvider`:

   ```tsx
   import { ThunderIDProvider } from "@thunderid/react";
   import config from "./config";

   <ThunderIDProvider baseUrl={config.baseUrl} clientId={config.clientId} scopes={config.scopes}>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </ThunderIDProvider>
   ```

4. `src/components/Header.tsx`: replace the `Guest` chip with sign-in state. `SignedIn` and
   `SignedOut` render their children depending on the session; `signIn()` sends the browser to
   Gate, ThunderID's hosted sign-in pages, and `signOut()` ends the session. Copy from
   `solution/acme-travel-web/src/components/Header.tsx`.

5. `src/App.tsx`: wrap the `/trips` route in `RequireSignIn`, and hand the SDK's
   `getAccessToken` to the API client with `configureApi`. Copy from
   `solution/acme-travel-web/src/App.tsx`.

6. `src/api.ts`: add the `Authorization: Bearer` header to every call. Copy from
   `solution/acme-travel-web/src/api.ts`. The API ignores the header until Step 5; the app is
   simply ready for it.

7. Add `src/auth/useAccessTokenClaims.ts` and `src/components/TokenPanel.tsx`, and render
   `<TokenPanel />` at the bottom of `src/pages/MyTrips.tsx`. Copy all three from `solution/`.

Short on time? `pnpm apply-web` does points 2 to 7 in one command and leaves the API alone.

The dev server reloads. Open **My trips**: it now asks for a sign-in. Click **Sign in**: Gate
opens on https://localhost:8090, Alice signs in, and the browser comes back to the app with the
header showing her username.

### 1d. Look at the token

On My trips, click **Show my access token**.

| Claim | Meaning |
|-------|---------|
| `iss` | who signed it: ThunderID at https://localhost:8090 |
| `aud` | who it is for: the app's Client ID (after Step 5, the bookings API) |
| `sub` | who it is about: Alice's user id |
| `scope` | what the app asked for: `openid profile` |
| `exp` | when it stops working: one hour |

The app never saw Alice's password.

## Step 2: Travelers sign up (Console only)

1. Flows, New, type **Registration**, pick a template, name it `Acme Travel Sign-up`, save.
2. On the application's **Flows** tab, turn on **Sign-up Flow**, pick `Acme Travel Sign-up`, Save.
3. Gate shows a Sign up link once the sign-in flow has one. Open the app's sign-in flow in the
   Flow Builder: Widgets, **Self Sign Up Link**, add it, Auto Layout; set the Call node to
   `Acme Travel Sign-up`; connect its success handle to `authorization_check`; Save.

In the app: Sign out, Sign in, **Don't have an account? Sign up**. Bob signs himself up and
lands in the app. He appears under Users. No code changed.

## Step 3: A second factor (Console only)

You need a sign-in flow with a password step followed by an email one-time code. The quickest
way to get one is the application wizard: create an application with **Multi-Factor Login**
under Security and the wizard generates that flow. You can also build it in the Flow Builder.
(The template named "Email OTP" is passwordless sign-in, not a second factor.)

On Acme Travel Web's **Flows** tab, set **Sign-in Flow** to the MFA flow and Save.

In the app: Sign out, Sign in as Alice, password, then **Verify your identity** asks for the
6-digit code from her inbox (valid for 2 minutes). No code changed.

## Step 4: Make it look like Acme, and greet Alice by name (Console only)

1. Design, Themes, new theme `Acme`, pick **Teal**, create. On the application's
   **Customization** tab choose `Acme`, Save. Gate is now teal.
2. On the application's **Token** tab, under Access Token, add `given_name` and `family_name`,
   Save.

In the app: Sign out, Sign in. The header chip changes from `alice` to **Alice Traveler**: the
app reads those two claims from the token, and they were not there before. No code changed.

## Step 5: Protect the API

### 5a. Describe the API to ThunderID (Console)

1. Resource Servers, New, **API**: name `Acme Bookings API`, identifier
   `https://api.acme.example/bookings`, permission delimiter **Colon**. Leave
   **Make this the default resource server** ticked: it makes this identifier the audience of
   every token Acme Travel Web asks for.
2. Add resource `booking` with actions `read` and `write`. That gives the permissions
   `booking:read` and `booking:write`.
3. Roles, New: `Traveler`, tick both permissions. Open the role, **Assignments**, add Alice.
   Bob gets no role.

### 5b. Ask for the permissions (code, one line)

`acme-travel-web/public/runtime.json`:

```json
"scopes": ["openid", "profile", "booking:read", "booking:write"]
```

### 5c. Make the API check the token (code)

```bash
pnpm --filter acme-bookings-api add jose
```

Replace `acme-bookings-api/server.js` with `solution/acme-bookings-api/server.js`. The new parts:

- `createRemoteJWKSet(https://localhost:8090/oauth2/jwks)`: ThunderID's public signing keys.
- `requireToken`: `jwtVerify` checks signature, issuer, audience and expiry. No token: 401.
- `requireScope("booking:read")` on `GET /api/bookings` and `requireScope("booking:write")` on
  `POST /api/bookings`. Missing permission: 403.

Restart with `pnpm dev`. The API's dev script sets `NODE_TLS_REJECT_UNAUTHORIZED=0` so Node
accepts the self-signed certificate when it fetches the keys; a real deployment has a real
certificate and does not need it.

### 5d. Try it

- Alice: Sign out, Sign in. My trips loads (200). The token panel now shows
  `aud: https://api.acme.example/bookings` and `scope: openid profile booking:read booking:write`.
- Bob: Sign out, Sign in as Bob. My trips shows **Could not load your trips. Forbidden: this
  action needs the booking:read permission** (403). Same app, same API, different token.
- Anonymous: `curl -i http://localhost:4001/api/bookings` answers 401.

Give Bob the Traveler role in the Console, sign him in again, and his trips load. The app was
never redeployed.

## Step 6: Identity as code (Console only)

Import / Export, **Export**. The summary lists everything built in this guide: the application,
the flows, the theme, the resource server, the role. Open the YAML: `Acme Travel Web` names its
sign-in flow, sign-up flow and theme, and its `clientId` is `{{.ACME_TRAVEL_WEB_CLIENT_ID}}`,
filled from the `.env` file next to it. One `.env` per environment, the same YAML for all of them.

## Start over

```bash
pnpm reset
```

Then remove the demo resources in the Console, or start from a fresh ThunderID.
