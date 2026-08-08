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
# Tell Prisma (and any detect-package-manager logic) that this is an npm environment.
# Without this, Prisma finds .yarn-integrity in node_modules and tries to invoke
# "yarn workspace" which fails in a slim container with no workspace root.
ENV npm_config_user_agent="npm/10.0.0 node/v20.0.0 linux x64"

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Remove the yarn integrity marker so Prisma does not detect yarn and avoids
# calling "yarn workspace" during migrate deploy.
RUN rm -f ./node_modules/.yarn-integrity

EXPOSE 4000

# Run Prisma migrations via direct node invocation (no yarn, no corepack).
# Then start the compiled API server.
CMD ["sh", "-c", "echo '==> Migrating DB...' && node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma && echo '==> Starting API...' && node dist/index.js"]
