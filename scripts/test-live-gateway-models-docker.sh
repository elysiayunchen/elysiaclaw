#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${ELYSIACLAW_IMAGE:-${CLAWDBOT_IMAGE:-elysiaclaw:local}}"
LIVE_IMAGE_NAME="${ELYSIACLAW_LIVE_IMAGE:-${CLAWDBOT_LIVE_IMAGE:-${IMAGE_NAME}-live}}"
CONFIG_DIR="${ELYSIACLAW_CONFIG_DIR:-${CLAWDBOT_CONFIG_DIR:-$HOME/.elysiaclaw}}"
WORKSPACE_DIR="${ELYSIACLAW_WORKSPACE_DIR:-${CLAWDBOT_WORKSPACE_DIR:-$HOME/.elysiaclaw/workspace}}"
PROFILE_FILE="${ELYSIACLAW_PROFILE_FILE:-${CLAWDBOT_PROFILE_FILE:-$HOME/.profile}}"

PROFILE_MOUNT=()
if [[ -f "$PROFILE_FILE" ]]; then
  PROFILE_MOUNT=(-v "$PROFILE_FILE":/home/node/.profile:ro)
fi

read -r -d '' LIVE_TEST_CMD <<'EOF' || true
set -euo pipefail
[ -f "$HOME/.profile" ] && source "$HOME/.profile" || true
tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT
tar -C /src \
  --exclude=.git \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=ui/dist \
  --exclude=ui/node_modules \
  -cf - . | tar -C "$tmp_dir" -xf -
ln -s /app/node_modules "$tmp_dir/node_modules"
ln -s /app/dist "$tmp_dir/dist"
cd "$tmp_dir"
pnpm test:live
EOF

echo "==> Build live-test image: $LIVE_IMAGE_NAME (target=build)"
docker build --target build -t "$LIVE_IMAGE_NAME" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

echo "==> Run gateway live model tests (profile keys)"
docker run --rm -t \
  --entrypoint bash \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e HOME=/home/node \
  -e NODE_OPTIONS=--disable-warning=ExperimentalWarning \
  -e ELYSIACLAW_LIVE_TEST=1 \
  -e ELYSIACLAW_LIVE_GATEWAY_MODELS="${ELYSIACLAW_LIVE_GATEWAY_MODELS:-${CLAWDBOT_LIVE_GATEWAY_MODELS:-modern}}" \
  -e ELYSIACLAW_LIVE_GATEWAY_PROVIDERS="${ELYSIACLAW_LIVE_GATEWAY_PROVIDERS:-${CLAWDBOT_LIVE_GATEWAY_PROVIDERS:-}}" \
  -e ELYSIACLAW_LIVE_GATEWAY_MAX_MODELS="${ELYSIACLAW_LIVE_GATEWAY_MAX_MODELS:-${CLAWDBOT_LIVE_GATEWAY_MAX_MODELS:-24}}" \
  -e ELYSIACLAW_LIVE_GATEWAY_MODEL_TIMEOUT_MS="${ELYSIACLAW_LIVE_GATEWAY_MODEL_TIMEOUT_MS:-${CLAWDBOT_LIVE_GATEWAY_MODEL_TIMEOUT_MS:-}}" \
  -v "$ROOT_DIR":/src:ro \
  -v "$CONFIG_DIR":/home/node/.elysiaclaw \
  -v "$WORKSPACE_DIR":/home/node/.elysiaclaw/workspace \
  "${PROFILE_MOUNT[@]}" \
  "$LIVE_IMAGE_NAME" \
  -lc "$LIVE_TEST_CMD"
