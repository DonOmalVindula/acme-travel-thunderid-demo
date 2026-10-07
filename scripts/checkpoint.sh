#!/usr/bin/env bash
# Jumps the working tree to a checkpoint and installs its dependencies.
#   scripts/checkpoint.sh start           the unsecured app (main)
#   scripts/checkpoint.sh step-1-sign-in  web app wired to ThunderID
#   scripts/checkpoint.sh step-5-protect-api  web app and API secured (solution)
# Local edits are discarded: this is for jumping, not for saving work.
set -euo pipefail
cd "$(dirname "$0")/.."

target="${1:-}"
case "$target" in
  start|main|checkpoint-0-start) ref="main" ;;
  step-1|step-1-sign-in) ref="step-1-sign-in" ;;
  step-5|step-5-protect-api|solution|finished) ref="step-5-protect-api" ;;
  "") echo "usage: scripts/checkpoint.sh start | step-1-sign-in | step-5-protect-api"; exit 1 ;;
  *) ref="$target" ;;
esac

git checkout -f "$ref" --
pnpm install
echo
echo "Now at: $(git describe --tags --always)"
if [ ! -f acme-travel-web/.env.local ] && [ "$ref" != "main" ]; then
  echo "Reminder: put your Client ID in acme-travel-web/.env.local as VITE_THUNDERID_CLIENT_ID=..."
fi
echo "Run: pnpm dev"
