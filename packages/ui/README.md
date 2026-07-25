# @repo/ui

Shared design system for the Carousel Marketplace monorepo. Built on [shadcn/ui](https://ui.shadcn.com) + Radix UI primitives + Tailwind v4.

---

## Usage

```ts
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { cn } from '@repo/ui/utils/cn';
```

All 46 shadcn components are available via `@repo/ui/components/{name}`.

---

## Structure

```
packages/ui/
├── src/
│   ├── components/         # 46 shadcn/ui components (owned here, not in apps/)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...             # see full list below
│   ├── utils/
│   │   └── cn.ts           # clsx + tailwind-merge helper
│   └── code.tsx            # <Code /> syntax highlight component
└── package.json            # exports map
```

---

## Available Components

| Category       | Components                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **Inputs**     | button, input, textarea, select, checkbox, switch, slider, radio-group, toggle, toggle-group                    |
| **Form**       | form, label                                                                                                     |
| **Display**    | avatar, badge, card, skeleton, progress, alert, separator, table, aspect-ratio, scroll-area                     |
| **Overlay**    | dialog, alert-dialog, sheet, drawer, popover, tooltip, hover-card, dropdown-menu, context-menu, command, sonner |
| **Navigation** | tabs, breadcrumb, pagination, navigation-menu, menubar, input-otp                                               |
| **Layout**     | accordion, collapsible, resizable, carousel, sidebar                                                            |
| **Data Viz**   | chart                                                                                                           |

---

## Exports

```json
{
  "./components/*": "./src/components/*.tsx",
  "./utils/cn": "./src/utils/cn.ts"
}
```

---

## Adding New Components

From the **apps/frontend** directory:

```bash
pnpm shadcn <component-name>
# or install all:
pnpm shadcn
```

The script (`apps/frontend/scripts/add-shadcn.sh`) writes to `apps/frontend/src/components/ui/` by default (shadcn CLI limitation). After adding, manually move the file to `packages/ui/src/components/` and fix the import:

```diff
- import { cn } from "@/lib/utils"
+ import { cn } from "../utils/cn"
```

---

## Tailwind Scanning

`apps/frontend/app/globals.css` must include:

```css
@source "../../../packages/ui/src";
```

> Path is relative to the CSS file (`apps/frontend/app/globals.css`), not the project root.

---

## Notes

- Components are shadcn-generated — you own the code, edit directly as needed.
- Cross-component imports use relative paths (`./button`, `./tooltip`).
- `next-themes` is a dependency (used by `sonner.tsx`) — this package is Next.js-aware by design.
