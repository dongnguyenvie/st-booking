#!/usr/bin/env bash
# Copies apps/api/schema.gql → apps/web-vue/api-service/schema.gql
# Usage: pnpm sync-schema

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MONOREPO_DIR="$(cd "$APP_DIR/../.." && pwd)"

SRC="$MONOREPO_DIR/apps/api/schema.gql"
DEST="$APP_DIR/api-service/schema.gql"

if [ ! -f "$SRC" ]; then
  echo "ERROR: $SRC not found. Start the API server first to generate the schema."
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp "$SRC" "$DEST"
echo "Synced: apps/api/schema.gql → apps/web-vue/api-service/schema.gql"
