#!/usr/bin/env bash
# Add shadcn/ui components to apps/frontend
# Usage: ./scripts/add-shadcn.sh [component1 component2 ...]
# Example: ./scripts/add-shadcn.sh button card input
# No args: installs ALL components

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ALL_COMPONENTS=(
  accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button
  calendar card carousel chart checkbox collapsible command context-menu
  dialog drawer dropdown-menu form hover-card input input-otp label menubar
  navigation-menu pagination popover progress radio-group resizable scroll-area
  select separator sheet sidebar skeleton slider sonner switch table tabs
  textarea toggle toggle-group tooltip
)

if [ $# -gt 0 ]; then
  COMPONENTS=("$@")
else
  COMPONENTS=("${ALL_COMPONENTS[@]}")
fi

echo "Adding ${#COMPONENTS[@]} shadcn component(s)..."
pnpm dlx shadcn@latest add "${COMPONENTS[@]}" --cwd "$ROOT_DIR" --overwrite
echo "Done."
