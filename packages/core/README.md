# @repo/core

Shared business logic, constants, enums, and utilities used across **both frontend (`apps/frontend`) and backend (`apps/api`)**.

> This package is compiled — runs `tsc` to `dist/` before being consumed.

## Build

```bash
pnpm build   # compile src/ → dist/
pnpm dev     # watch mode
```

---

## Usage

```ts
import { APP_NAME, DEFAULT_PAGE_SIZE, Privilege } from '@repo/core';
import dayjs from '@repo/core/lib/dayjs'; // pre-configured with plugins
```

---

## Structure

```
packages/core/
├── src/
│   ├── constants/
│   │   └── app.constant.ts     # APP_NAME, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, ONE_DAY_SECONDS
│   ├── enums/
│   │   └── privilege.enum.ts   # Privilege (SUPER_ADMIN = 1)
│   ├── lib/
│   │   └── dayjs.ts            # dayjs pre-configured with plugins (utc, tz, duration, relativeTime, ...)
│   └── index.ts                # barrel export
└── dist/                       # compiled output (gitignored)
```

---

## Exports

| Export              | Source    | Description                                                                                                   |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `APP_NAME`          | constants | Application name string                                                                                       |
| `DEFAULT_PAGE_SIZE` | constants | Default pagination size (20)                                                                                  |
| `MAX_PAGE_SIZE`     | constants | Max pagination size (100)                                                                                     |
| `ONE_DAY_SECONDS`   | constants | 86400                                                                                                         |
| `Privilege`         | enums     | Numeric privilege flags: `SUPER_ADMIN = 1`                                                                    |
| `dayjs`             | lib       | dayjs with utc, timezone, isBetween, isSameOrBefore, isSameOrAfter, duration, customParseFormat, relativeTime |

---

## Rules

- **No framework-specific code** — no Next.js, NestJS, React, or Node.js built-ins. Must run in any environment.
- **No side effects** — except `dayjs.ts` which extends plugins on import.
- Always `pnpm build` after changes before consuming in other packages.
