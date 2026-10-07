#!/usr/bin/env bash
# Step 1c in one go: adds the SDK and copies the web app's finished files.
# Leaves the bookings API untouched, so the API stays open until Step 5.
set -euo pipefail
cd "$(dirname "$0")/.."

pnpm --filter acme-travel-web add @thunderid/react@^1.1.0
cp -R solution/acme-travel-web/src acme-travel-web/
if [ ! -f acme-travel-web/public/runtime.json ]; then
  cp solution/acme-travel-web/public/runtime.json acme-travel-web/public/runtime.json
  echo "Created acme-travel-web/public/runtime.json: put your Client ID in it."
fi

echo "Web app wired to ThunderID. The dev server reloads on its own."
