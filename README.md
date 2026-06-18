# saifii-cli

A CLI tool to instantly scaffold projects from production-ready boilerplates. Stop copying files — just run one command.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/saifiimuhammad/saifii-cli.git
cd saifii-cli
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install globally on your machine

```bash
sudo npm install -g .
```

### 4. Verify installation

```bash
saifii --version
```

---

## Usage

### Create a project

```bash
saifii create <template-name> <project-name>
```

**Example:**

```bash
saifii create react my-app
saifii create django my-api
saifii create laravel my-site
```

This will:
1. Copy the boilerplate into a new `<project-name>` folder
2. Copy `.env.example` → `.env` automatically
3. Initialize a git repository
4. Install dependencies using the right package manager

### List available templates

```bash
saifii list
```

---

## Available Templates

| Template | Stack | Language |
|---|---|---|
| `react` | React 19 + TypeScript + Vite + Tailwind CSS v4 | JavaScript / TypeScript |
| `next` | Next.js 15 + TypeScript + Tailwind CSS v4 + App Router | JavaScript / TypeScript |
| `next-supabase-auth` | Next.js + Supabase Auth + Tailwind CSS | JavaScript / TypeScript |
| `monorepo` | Turborepo + Next.js + Express API + pnpm workspaces | TypeScript |
| `express` | Express.js + CORS + Cookie Parser + dotenv | JavaScript |
| `django` | Django 5 + Django REST Framework + CORS headers | Python |
| `fastapi` | FastAPI + SQLAlchemy + Pydantic Settings + Alembic | Python |
| `laravel` | Laravel 11 + MVC structure + SQLite default | PHP |
| `vanilla` | HTML + CSS + Vanilla JavaScript | JavaScript |

---

## Notes by Template Type

### Python projects (`django`, `fastapi`)

Dependency installation is **not** done automatically. After scaffolding, set up a virtual environment manually:

```bash
cd <project-name>
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### PHP / Laravel projects (`laravel`)

Requires [Composer](https://getcomposer.org/) installed on your machine. The CLI runs `composer install` and `php artisan key:generate` automatically.

### pnpm projects (`monorepo`, `next-supabase-auth`)

Requires [pnpm](https://pnpm.io/) installed. The CLI detects `pnpm-workspace.yaml` or `pnpm-lock.yaml` and runs `pnpm install` automatically.

---

## Requirements

| Tool | Minimum Version |
|---|---|
| Node.js | 18+ |
| npm | 8+ |
| PHP + Composer | 8.2+ (for `laravel` only) |
| Python + pip | 3.10+ (for `django` / `fastapi` only) |
| pnpm | 8+ (for `monorepo` / `next-supabase-auth` only) |
