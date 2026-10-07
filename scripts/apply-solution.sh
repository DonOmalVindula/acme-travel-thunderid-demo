#!/usr/bin/env bash
# Copies the finished, ThunderID-secured files over the two apps.
# Use it as the fallback during the live demo, or to see the end state.
set -euo pipefail
cd "$(dirname "$0")/.."

cp -R solution/acme-travel-web/public solution/acme-travel-web/src acme-travel-web/
cp solution/acme-bookings-api/package.json solution/acme-bookings-api/server.js acme-bookings-api/

pnpm --filter acme-travel-web add @thunderid/react@^1.1.0
pnpm install

echo "Solution applied."
echo "Next: put your Client ID into acme-travel-web/public/runtime.json, then restart with: pnpm dev"
