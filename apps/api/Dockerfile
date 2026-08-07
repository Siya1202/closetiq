# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl
RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN yarn install --immutable

COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN yarn workspace @closetiq/db prisma generate

RUN yarn workspace @closetiq/shared build 2>/dev/null || true
RUN yarn workspace @closetiq/db build
RUN yarn workspace @closetiq/api build


# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Compiled API output
COPY --from=builder /app/apps/api/dist ./dist

# All node_modules (hoisted workspace deps including prisma client)
COPY --from=builder /app/node_modules ./node_modules

# Prisma schema + migrations for migrate deploy
COPY --from=builder /app/packages/db/prisma ./prisma

# Generated prisma client binaries
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

# Invoke prisma CLI directly via node (no yarn, no corepack, no package.json needed).
# Then start the API. Both commands receive env vars injected by Railway at runtime.
CMD ["sh", "-c", "echo '==> Migrating...' && node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma && echo '==> Starting server...' && node dist/index.js"]
