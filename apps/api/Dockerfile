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

# Workspace node_modules (contains hoisted deps + symlinks to @closetiq/* packages)
COPY --from=builder /app/node_modules ./node_modules

# The @closetiq/db symlink in node_modules points to ../../packages/db
# We must copy the actual package so the symlink resolves correctly at runtime
COPY --from=builder /app/packages/db ./packages/db

# The @closetiq/shared symlink points to ../../packages/shared — copy it too
COPY --from=builder /app/packages/shared ./packages/shared

# Prisma schema + migrations for migrate deploy at startup
COPY --from=builder /app/packages/db/prisma ./prisma

# Generated Prisma client binaries
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma && node dist/index.js"]
