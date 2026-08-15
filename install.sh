#!/usr/bin/env bash
# Install the dsh-learning-mode agent preset into the DSH user preset root.
# Usage: bash install.sh   (run from the repo root)
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/learning-mode"
DEST="${DSH_HOME:-$HOME/.dsh}/.agent-presets/learning-mode"

if [[ ! -f "$SRC/agent.cordis.yml" ]]; then
  echo "error: preset files not found next to this script ($SRC)" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
if [[ -e "$DEST" ]]; then
  echo "note: $DEST already exists, backing it up to $DEST.bak.$(date +%s)"
  cp -r "$DEST" "$DEST.bak.$(date +%s)"
  rm -rf "$DEST"
fi

cp -r "$SRC" "$DEST"
echo "installed: $DEST"
echo "next: open DSH web UI, start a new session and pick 学习模式."
