#!/bin/bash
set -Eeuo pipefail

PORT=3000
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-${PORT}}"

cd "${COZE_WORKSPACE_PATH}"

kill_port_if_listening() {
  local pids=""
  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -tiTCP:"${DEPLOY_RUN_PORT}" -sTCP:LISTEN 2>/dev/null || true)
  elif command -v ss >/dev/null 2>&1; then
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${DEPLOY_RUN_PORT}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
  fi
  if [[ -z "${pids}" ]]; then
    echo "Port ${DEPLOY_RUN_PORT} is free."
    return
  fi
  echo "Port ${DEPLOY_RUN_PORT} in use by PIDs: ${pids} (SIGTERM)"
  # shellcheck disable=SC2086
  kill ${pids} 2>/dev/null || true
  sleep 1
}

echo "Clearing port ${DEPLOY_RUN_PORT} before start."
kill_port_if_listening
echo "Starting Next.js on http://localhost:${DEPLOY_RUN_PORT} ..."

# Prefer Next CLI locally (macOS-friendly); fall back to custom server if needed
if [[ "${USE_CUSTOM_SERVER:-0}" == "1" ]]; then
  PORT=${DEPLOY_RUN_PORT} pnpm tsx watch src/server.ts
else
  pnpm exec next dev -H 0.0.0.0 -p "${DEPLOY_RUN_PORT}"
fi
