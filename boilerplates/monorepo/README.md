# 🏗 Monorepo Boilerplate

A production-ready monorepo built with **pnpm workspaces** + **Turborepo**.

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | Next.js 14 (App Router, Turbopack) + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB (Mongoose) |
| Cache / Queue | Redis + BullMQ |
| Auth | JWT (access + refresh token rotation) |
| Validation | Zod |
| Logging | Pino |
| State (web) | Zustand + TanStack Query |

## Structure

```
.
├── apps/
│   ├── api/                  # Express API
│   │   └── src/
│   │       ├── config/       # env, db, redis, logger
│   │       ├── controllers/  # request handlers
│   │       ├── helpers/      # appError, asyncHandler, jwt, paginate, apiResponse
│   │       ├── jobs/         # cron jobs (BullMQ scheduler)
│   │       ├── middlewares/  # auth, error, rate limit, validate, requestId
│   │       ├── models/       # Mongoose models
│   │       ├── routes/       # Express routers
│   │       ├── services/     # business logic
│   │       ├── types/        # TypeScript types
│   │       ├── validators/   # Zod schemas
│   │       └── workers/      # BullMQ workers (email, etc.)
│   └── web/                  # Next.js App Router
│       └── src/
│           ├── app/          # pages + layouts
│           ├── components/   # ui, layout, forms
│           ├── hooks/        # custom React hooks
│           ├── lib/          # axios client
│           ├── services/     # API service functions
│           ├── store/        # Zustand stores
│           └── types/        # TypeScript types
├── packages/
│   ├── shared/               # shared types + utils (string, date)
│   ├── ui/                   # shared React component library
│   └── config/               # shared ESLint / TS configs
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 8 (`npm i -g pnpm`)
- Docker (for MongoDB + Redis)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Set up environment
```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
# Edit both files with your values
```

### 3. Start infrastructure
```bash
docker-compose up -d
```

### 4. Run in development
```bash
pnpm dev          # starts all apps in parallel
# or individually:
pnpm --filter @repo/api dev
pnpm --filter @repo/web dev
```

### 5. Build for production
```bash
pnpm build
```

## API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me

GET    /api/v1/users          (admin)
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id      (admin)

GET    /health
```

## Adding a New App

```bash
mkdir apps/my-service
cd apps/my-service
pnpm init
# Add "name": "@repo/my-service" to package.json
```

## Adding a New Worker

```ts
// apps/api/src/workers/my.worker.ts
import { Worker, Queue } from 'bullmq';
// ... follow email.worker.ts pattern

// Register in apps/api/src/workers/index.ts
```
