#!/usr/bin/env bash
# One-shot installer for git hooks tracked in this repo.
# Run once after cloning: `bash hooks/install.sh`
# Idempotent — re-running just refreshes the symlinks.
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK_DIR="$ROOT/.git/hooks"
TRACKED="$ROOT/hooks"

for hook in pre-push; do
  if [[ -f "$TRACKED/$hook" ]]; then
    ln -sf "../../hooks/$hook" "$HOOK_DIR/$hook"
    chmod +x "$TRACKED/$hook"
    echo "✓ Installed $hook → $HOOK_DIR/$hook"
  fi
done
