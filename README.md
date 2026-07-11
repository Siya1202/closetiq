# ClosetIQ

AI-powered wardrobe intelligence — lazy-logging closet tracker with cost-per-wear analytics, style-drift tracking, and reverse outfit matching.

## Problem

Wardrobe/fashion apps assume you'll photograph your entire closet upfront. Nobody does that. ClosetIQ is designed around **lazy, incremental logging** — you log one item at a time, as you buy or wear things, and the system builds insight gradually instead of demanding a big upfront cost.

## Core Idea

Every logged item gets a vision-based embedding (category, color, style). Over time, this sparse, passively-collected data feeds:
- personalized cost-per-wear analytics
- style-drift visualization (clustering embeddings over time)
- reverse outfit matching (find compatible items you already own, from a single reference photo)

No CSP solver here (that's the trip planner) — the technical spine of this project is **vision embeddings → vector search/clustering → personalized recommendation from sparse data**.

## Tech Stack

- **Frontend:** Next.js 15 (App Router, TS)
- **Backend:** Node.js / Express
- **DB:** PostgreSQL + Prisma + pgvector extension
- **Auth:** JWT
- **AI:**
  - Vision tagging: multimodal model via OpenRouter (extract category/color/pattern/formality from a photo)
  - Embeddings: CLIP-style image embeddings for similarity/clustering
  - Narrative generation: LLM for outfit suggestion rationale, style-drift summaries
- **Monorepo:** Yarn workspaces
- **Background jobs:** cron (weekly style-drift recompute, cost-per-wear recompute)
- **Storage:** object storage for item photos (S3-compatible or local for dev)

## MVP Scope (build this first)

1. **Auth** — signup/login, JWT
2. **Item logging** — upload photo → vision model auto-tags (category, color, season, formality) → editable → saved to Postgres, embedding stored via pgvector
3. **Wear logging** — one-tap "wore this today" against existing items, timestamped
4. **Cost-per-wear analytics** — price ÷ wears per item, ranked list, "regret buys" flag
5. **Basic dashboard** — wardrobe value, cost-per-wear leaderboard, underused items (not worn in 60+ days)

## Stretch Goals (post-MVP, in priority order)

6. **Style drift tracking** — cluster embeddings over time, visualize shift (e.g. streetwear → minimalist), monthly "dominant style" summary
7. **Reverse outfit matching** — upload one reference photo → vector search your closet for compatible items → suggests one item to buy if no match exists
8. **Outfit suggestions** — occasion + weather API + owned items → suggested combos, avoids recent repeats
9. **Group/social layer** — friends log closets, embedding-based "borrow X's jacket for this" matching, swap requests

## Data Model (high level)

```
User
 └── Item (photo_url, category, color, pattern, season, formality, price, purchase_date, embedding[vector])
      └── WearLog (item_id, worn_at)
 └── Friendship (for stretch: group layer)
```

## Why this architecture

- **Vector search (pgvector)** is the real technical core — same conceptual pattern used in production RAG/recommendation systems, directly relevant for interviews.
- **Sparse-data recommendation** (cost-per-wear regret prediction, style clustering) is a legitimate small-scale ML problem trained on the user's own behavior, not a thin LLM wrapper.
- **Lazy logging design** solves the real UX problem (nobody bulk-photographs their closet) while still producing a usable dataset over weeks.

## Full Project Structure

```
closetiq/
├── apps/
│   ├── web/                        # Next.js 15 frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── closet/page.tsx           # item grid/list
│   │   │   │   ├── closet/[itemId]/page.tsx  # item detail + wear log
│   │   │   │   ├── closet/add/page.tsx       # upload + auto-tag flow
│   │   │   │   ├── analytics/page.tsx        # cost-per-wear, regret buys
│   │   │   │   ├── style-drift/page.tsx      # stretch
│   │   │   │   └── match/page.tsx            # reverse outfit matching, stretch
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                 # buttons, cards, modals
│   │   │   ├── ItemCard.tsx
│   │   │   ├── WearLogButton.tsx
│   │   │   ├── UploadDropzone.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts       # fetch wrapper to Express API
│   │   │   └── auth.ts             # JWT helpers, session context
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                         # Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.routes.ts
│       │   │   ├── items.routes.ts
│       │   │   ├── wearlogs.routes.ts
│       │   │   ├── analytics.routes.ts
│       │   │   ├── match.routes.ts          # stretch
│       │   │   └── style.routes.ts          # stretch
│       │   ├── controllers/
│       │   │   ├── auth.controller.ts
│       │   │   ├── items.controller.ts
│       │   │   ├── wearlogs.controller.ts
│       │   │   └── analytics.controller.ts
│       │   ├── services/
│       │   │   ├── vision.service.ts        # OpenRouter vision tagging calls
│       │   │   ├── embedding.service.ts     # image embedding generation
│       │   │   ├── costPerWear.service.ts
│       │   │   └── matching.service.ts      # pgvector similarity search, stretch
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts       # JWT verification
│       │   │   └── error.middleware.ts
│       │   ├── jobs/
│       │   │   ├── recomputeCostPerWear.cron.ts
│       │   │   └── recomputeStyleDrift.cron.ts   # stretch
│       │   ├── config/
│       │   │   └── env.ts
│       │   └── index.ts             # server entrypoint
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── db/                          # Prisma schema + client
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # User, Item, WearLog, Friendship models + pgvector
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── client.ts            # exported Prisma client singleton
│   │   └── package.json
│   │
│   └── shared/                      # shared types/utils across web + api
│       ├── src/
│       │   ├── types.ts             # Item, WearLog, User interfaces
│       │   └── constants.ts
│       └── package.json
│
├── .env.example
├── .gitignore
├── package.json                     # root workspace config
├── yarn.lock
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- Yarn (v1 classic or Berry — match whatever ai-todo-mono used)
- PostgreSQL 15+ with the `pgvector` extension available
- An OpenRouter API key (for vision tagging + LLM narration)

### 1. Clone and install

```bash
git clone <your-repo-url> closetiq
cd closetiq
yarn install
```

### 2. Set up PostgreSQL + pgvector

```bash
# create the database
createdb closetiq

# enable pgvector (run inside psql, connected to closetiq db)
psql -d closetiq -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 3. Environment variables

Copy the example env file and fill in values:

```bash
cp .env.example .env
```

`.env` should contain:

```
DATABASE_URL="postgresql://user:password@localhost:5432/closetiq"
JWT_SECRET="your-jwt-secret"
OPENROUTER_API_KEY="your-openrouter-key"
PORT=4000
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 4. Run Prisma migrations

```bash
cd packages/db
yarn prisma migrate dev --name init
yarn prisma generate
cd ../..
```

### 5. Start dev servers

From the root (using Yarn workspaces to run both concurrently):

```bash
yarn dev
```

This should start:
- Next.js frontend on `http://localhost:3000`
- Express API on `http://localhost:4000`

If you don't have a root `dev` script wired up yet, run them separately for now:

```bash
# terminal 1
cd apps/api && yarn dev

# terminal 2
cd apps/web && yarn dev
```

### 6. Verify

- Visit `http://localhost:3000/signup`, create an account
- Hit `http://localhost:4000/api/health` (add a simple health route) to confirm the API is up
- Try uploading one item photo from `/closet/add` to confirm the vision-tagging pipeline round-trips

## Status

🚧 Planning complete. Starting MVP build: auth → item logging → wear logging → cost-per-wear dashboard.