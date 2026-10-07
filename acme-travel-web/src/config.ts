// Reads public/runtime.json at startup, so the app can be pointed at any
// ThunderID instance without a rebuild. This is the only file that knows
// where ThunderID lives.
//
// The client ID can also come from VITE_THUNDERID_CLIENT_ID in an untracked
// acme-travel-web/.env.local file, which keeps it out of the repository.

export type RuntimeConfig = {
  clientId: string;
  baseUrl: string;
  scopes: string[];
};

const response = await fetch("/runtime.json");
const raw = (await response.json()) as Partial<RuntimeConfig>;

const config: RuntimeConfig = {
  clientId: raw.clientId || import.meta.env.VITE_THUNDERID_CLIENT_ID || "",
  baseUrl: raw.baseUrl ?? "",
  scopes: raw.scopes ?? ["openid", "profile"],
};

export default config;
