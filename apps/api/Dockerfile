# ── Stage 1: Builder ──────────────────────────────────────────────────────────
# Install all dependencies, generate Prisma client, and compile TypeScript.
FROM node:20-alpine AS builder

# Install openssl for Prisma binary compatibility on Alpine
RUN apk add --no-cache openssl

# Enable corepack so the `packageManager` field in package.json is respected
# This ensures the correct Yarn version (4.x Berry) is used, not Yarn Classic.
RUN corepack enable

WORKDIR /app

# Copy workspace manifests + lockfile first for better layer caching.
# We need ALL package.json files so Yarn can resolve the full workspace graph.
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install all dependencies (including dev — needed for tsc + tsx).
# --immutable is the Yarn Berry (v4) equivalent of --frozen-lockfile.
RUN yarn install --immutable

# Copy the rest of the source
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Generate Prisma client (must happen before tsc so types resolve)
RUN yarn workspace @closetiq/db prisma generate

# Build all packages in dependency order: shared → db → api
RUN yarn workspace @closetiq/shared build 2>/dev/null || true
RUN yarn workspace @closetiq/db build
RUN yarn workspace @closetiq/api build


# ── Stage 2: Runner ───────────────────────────────────────────────────────────
# Slim production image — only compiled output + production deps.
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Copy compiled API
COPY --from=builder /app/apps/api/dist ./dist

# Copy workspace node_modules (contains all runtime deps + Prisma client)
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema + migrations (needed for `prisma migrate deploy` on startup)
COPY --from=builder /app/packages/db/prisma ./prisma

# Copy the generated Prisma client into the location Node resolves it from
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

# Copy the Prisma binary so we don't need npx (which tries to hit the network).
# Use the locally-installed prisma CLI from node_modules.
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Run migrations then start the server.
# `prisma migrate deploy` is idempotent — safe to run on every startup.
# Use the local binary — avoid npx which may not find prisma in production image.
CMD ["sh", "-c", "echo '==> Running DB migrations...' && ./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma && echo '==> Starting API server...' && node dist/index.js"]
