#!/usr/bin/env bash
set -euo pipefail

cd /repo

export ELYSIACLAW_STATE_DIR="/tmp/elysiaclaw-test"
export ELYSIACLAW_CONFIG_PATH="${ELYSIACLAW_STATE_DIR}/elysiaclaw.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${ELYSIACLAW_STATE_DIR}/credentials"
mkdir -p "${ELYSIACLAW_STATE_DIR}/agents/main/sessions"
echo '{}' >"${ELYSIACLAW_CONFIG_PATH}"
echo 'creds' >"${ELYSIACLAW_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${ELYSIACLAW_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm elysiaclaw reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${ELYSIACLAW_CONFIG_PATH}"
test ! -d "${ELYSIACLAW_STATE_DIR}/credentials"
test ! -d "${ELYSIACLAW_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${ELYSIACLAW_STATE_DIR}/credentials"
echo '{}' >"${ELYSIACLAW_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm elysiaclaw uninstall --state --yes --non-interactive

test ! -d "${ELYSIACLAW_STATE_DIR}"

echo "OK"
