import { useState } from "react";
import useAccessTokenClaims from "../auth/useAccessTokenClaims";

// A small inspector for the demo: shows what the access token says about the
// traveler. It is the same token the app sends to the bookings API.
export default function TokenPanel() {
  const claims = useAccessTokenClaims();
  const [open, setOpen] = useState(false);

  if (!claims) return null;

  const shown: Record<string, unknown> = {};
  for (const key of ["iss", "aud", "sub", "username", "given_name", "family_name", "scope", "exp"]) {
    if (claims[key] !== undefined) shown[key] = claims[key];
  }

  return (
    <section className="token-panel">
      <button className="btn btn-ghost" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide my access token" : "Show my access token"}
      </button>
      {open && <pre className="token-json">{JSON.stringify(shown, null, 2)}</pre>}
    </section>
  );
}
