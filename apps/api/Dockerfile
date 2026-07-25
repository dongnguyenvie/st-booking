FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── builder: install all deps, build, prune devDeps ───────────────────────────
FROM base AS builder
WORKDIR /app

# Layer cache: copy manifests before source
# .npmrc must come first — pnpm reads it before resolving packages
COPY .npmrc pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/api/package.json ./packages/api/
COPY packages/core/package.json ./packages/core/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Prisma schema must exist before install so postinstall (prisma generate) works
COPY apps/api/prisma ./apps/api/prisma

# Full install — runs postinstall scripts: prisma generate, @prisma/engines, etc.
RUN pnpm install --frozen-lockfile

# Copy source after install for better layer caching
COPY apps/api ./apps/api
COPY packages/api ./packages/api
COPY packages/core ./packages/core
COPY packages/typescript-config ./packages/typescript-config

# Build shared packages then api
RUN pnpm --filter @repo/core build && \
    pnpm --filter @repo/api build && \
    pnpm --filter api build

# Prune devDeps so the copied node_modules contains prod packages only
RUN pnpm prune --prod

# ── runner: lean production image ─────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Workspace manifests (needed for pnpm virtual-store module resolution)
COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/package.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/api/package.json ./packages/api/
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/typescript-config/package.json ./packages/typescript-config/

# Prod-only node_modules from builder.
# Root .pnpm virtual store + hoisted packages.
COPY --from=builder /app/node_modules ./node_modules

# Per-package node_modules: pnpm creates symlinks here for each workspace
# package's direct dependencies (non-hoisted). Required for module resolution.
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=builder /app/packages/core/node_modules ./packages/core/node_modules

# Compiled NestJS application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Compiled shared-package output
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/core/dist ./packages/core/dist

# Prisma schema + config (needed for `prisma migrate deploy` at runtime)
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts

WORKDIR /app/apps/api

EXPOSE 7001

# Health check uses wget (built into Alpine) against the existing GET /api/health endpoint.
# --interval: check every 30s
# --timeout: fail if no response within 5s
# --start-period: give the app 15s to boot before checks count
# --retries: mark unhealthy after 3 consecutive failures
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:7001/api/health || exit 1

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main"]
