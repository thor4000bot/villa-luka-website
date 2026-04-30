#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# Isla Studio — pre-deploy design audit gate
#
# Runs design_audit.py against this site repo. Fails (exit 1) if any
# HIGH/CRITICAL findings exist. Used as the body of a git pre-push hook
# so that pushing to GitHub (which auto-deploys to Cloudflare Pages)
# is blocked when the site doesn't pass the design rules.
#
# Bypass: `git push --no-verify`  (or run `./predeploy.sh --skip`).
#
# Cross-site portability: copy this file as-is into any villa-site repo.
# It locates the audit script via DESIGN_AUDIT env var, falling back to
# the canonical path under workspace/isla-studio.
# ──────────────────────────────────────────────────────────────────────
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUDIT="${DESIGN_AUDIT:-/Users/thor4000/.openclaw/workspace/isla-studio/design_audit.py}"

if [[ "${1:-}" == "--skip" ]]; then
  echo "⚠ Audit skipped via --skip flag."
  exit 0
fi

if [[ ! -f "$AUDIT" ]]; then
  echo "⚠ design_audit.py not found at $AUDIT — gate disabled."
  echo "  Set DESIGN_AUDIT=/path/to/design_audit.py to override."
  exit 0
fi

echo "→ Running design audit on $(basename "$ROOT")..."
if python3 "$AUDIT" "$ROOT"; then
  echo "✓ Audit passed — proceed with deploy."
  exit 0
else
  echo
  echo "✗ Audit found HIGH/CRITICAL violations. Push blocked."
  echo "  Fix the listed issues, OR bypass with: git push --no-verify"
  exit 1
fi
