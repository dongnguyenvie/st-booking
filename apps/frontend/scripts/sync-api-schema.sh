#!/usr/bin/env bash
# Copies apps/api/schema.gql → apps/frontend/src/api-service/schema.gql
# Run this after the API server has generated/updated its schema.
# Usage: pnpm sync-schema

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MONOREPO_DIR="$(cd "$WEB_DIR/../.." && pwd)"

SRC="$MONOREPO_DIR/apps/api/schema.gql"
DEST="$WEB_DIR/src/api-service/schema.gql"

if [ ! -f "$SRC" ]; then
  echo "ERROR: $SRC not found. Start the API server first to generate the schema."
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp "$SRC" "$DEST"
echo "Synced: apps/api/schema.gql → apps/frontend/src/api-service/schema.gql"
