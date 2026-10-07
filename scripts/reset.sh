#!/usr/bin/env bash
# Puts both apps back to the unsecured starting point.
set -euo pipefail
cd "$(dirname "$0")/.."

cp starter/acme-travel-web/package.json acme-travel-web/
cp starter/acme-travel-web/src/main.tsx starter/acme-travel-web/src/App.tsx starter/acme-travel-web/src/api.ts acme-travel-web/src/
cp starter/acme-travel-web/src/components/Header.tsx acme-travel-web/src/components/
cp starter/acme-travel-web/src/pages/MyTrips.tsx acme-travel-web/src/pages/
rm -f acme-travel-web/public/runtime.json acme-travel-web/src/config.ts acme-travel-web/src/components/TokenPanel.tsx
rm -rf acme-travel-web/src/auth

cp starter/acme-bookings-api/package.json starter/acme-bookings-api/server.js acme-bookings-api/

pnpm install

echo "Reset to the unsecured starting point. Restart with: pnpm dev"
