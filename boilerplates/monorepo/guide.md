## Running the Monorepo After Cloning

### 1. Install pnpm (if you don't have it)
```bash
npm install -g pnpm
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment files
```bash
# Copy the example env for the API
cp .env.example apps/api/.env

# Copy for the web app
cp .env.example apps/web/.env.local
```

Then open `apps/api/.env` and at minimum set:
```env
MONGODB_URI=mongodb://root:password@localhost:27017/myapp?authSource=admin
JWT_SECRET=some_random_32_char_string_here
REFRESH_TOKEN_SECRET=another_random_32_char_string
```

### 4. Start MongoDB + Redis via Docker
```bash
docker-compose up -d
```
This spins up MongoDB on `27017`, Redis on `6379`, and Redis Commander (GUI) on `http://localhost:8081`.

### 5. Run everything in dev mode
```bash
pnpm dev
```
This runs all apps in parallel via Turborepo:
- **API** → `http://localhost:4000`
- **Web** → `http://localhost:3000`
- **Health check** → `http://localhost:4000/health`

---

### Running apps individually
```bash
pnpm --filter @repo/api dev
pnpm --filter @repo/web dev
```

### Build for production
```bash
pnpm build
```

### Common issues

**`pnpm install` fails** — make sure you're on Node 18+:
```bash
node -v  # should be v18 or higher
```

**API crashes on start** — most likely the `.env` is missing or `MONGODB_URI` / `JWT_SECRET` are not set. The env validator will print exactly which fields are missing.

**MongoDB auth error** — if you're using the docker-compose MongoDB, the URI needs the auth params:
```
mongodb://root:password@localhost:27017/myapp?authSource=admin
```

**Port already in use** — change `API_PORT` in `apps/api/.env` or `3000` → another port in `apps/web/.env.local` via `PORT=3001`.