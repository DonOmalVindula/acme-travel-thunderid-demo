#!/usr/bin/env bash
# Puts both apps back to the unsecured starting point, in place: restores the files the guide
# changes from main, removes the files the guide adds, and reinstalls. Branches are not switched.
set -euo pipefail
cd "$(dirname "$0")/.."

git checkout main -- \
  acme-travel-web/package.json \
  acme-travel-web/src/main.tsx acme-travel-web/src/App.tsx acme-travel-web/src/api.ts \
  acme-travel-web/src/components/Header.tsx acme-travel-web/src/pages/MyTrips.tsx \
  acme-bookings-api/package.json acme-bookings-api/server.js \
  pnpm-lock.yaml
rm -f acme-travel-web/public/runtime.json acme-travel-web/src/config.ts acme-travel-web/src/components/TokenPanel.tsx
rm -rf acme-travel-web/src/auth

pnpm install

echo "Reset to the unsecured starting point. Restart with: pnpm dev"
