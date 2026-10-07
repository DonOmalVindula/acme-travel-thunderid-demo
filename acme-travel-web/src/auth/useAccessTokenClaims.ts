import { useEffect, useState } from "react";
import { useThunderID } from "@thunderid/react";

export type AccessTokenClaims = {
  sub?: string;
  aud?: string | string[];
  scope?: string;
  given_name?: string;
  family_name?: string;
  username?: string;
  [claim: string]: unknown;
};

// Decodes the payload of a JWT without verifying it. The browser only uses
// the claims for display; the bookings API is where the signature is checked.
function decodePayload(token: string): AccessTokenClaims {
  const [, payload] = token.split(".");
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as AccessTokenClaims;
}

export default function useAccessTokenClaims(): AccessTokenClaims | null {
  const { isSignedIn, getAccessToken } = useThunderID();
  const [claims, setClaims] = useState<AccessTokenClaims | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setClaims(null);
      return;
    }
    getAccessToken()
      .then((token) => setClaims(decodePayload(token)))
      .catch(() => setClaims(null));
  }, [isSignedIn, getAccessToken]);

  return claims;
}
