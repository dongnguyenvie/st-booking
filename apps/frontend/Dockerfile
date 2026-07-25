FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── builder stage: install all deps and build ──────────────────────────────
FROM base AS builder
WORKDIR /app

# Copy workspace manifests first for layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/core/package.json ./packages/core/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/frontend ./apps/frontend
COPY packages/core ./packages/core
COPY packages/ui ./packages/ui
COPY packages/typescript-config ./packages/typescript-config

# Build shared packages then web
RUN pnpm --filter @repo/core build
RUN pnpm --filter @repo/ui build

# Next.js build-time env vars (public only — no secrets)
ARG NEXT_PUBLIC_AUTH0_DOMAIN
ARG NEXT_PUBLIC_AUTH0_CLIENT_ID
ARG NEXT_PUBLIC_AUTH0_AUDIENCE
ARG NEXT_PUBLIC_USE_SSL=true
ARG NEXT_PUBLIC_API_ENDPOINT

RUN pnpm --filter frontend build

# ── runner stage: lean production image ────────────────────────────────────
FROM base AS runner
WORKDIR /app/apps/frontend

ENV NODE_ENV=production

# Next.js standalone output
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

CMD ["node", "apps/frontend/server.js"]
