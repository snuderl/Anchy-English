# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

English-Slovene vocabulary learning application. Students browse worksheets (word lists) and exercise sets (fill-in-the-blank), organized by categories. There is a public-facing student UI and an `/admin` section for managing content.

- **Backend**: Flask + SQLAlchemy (Python ≥3.13, managed with `uv`)
- **Frontend**: Vue 3 + Vue Router + Tailwind CSS (Vite build)
- **Database**: SQLite locally (`instance/baza.sqlite`), PostgreSQL in production (`DATABASE_URL`)
- **Deployment**: Heroku-style via `Procfile` (`gunicorn server:app`)

## Development Commands

```bash
# Backend
uv sync                          # install Python deps
uv run server.py                 # Flask on :8080 (override with PORT env var)

# Frontend (separate terminal)
cd anchy-english-vue
pnpm install
pnpm run dev                     # Vite dev server on :5173, proxies /api → :3000

# Production build
cd anchy-english-vue && pnpm run build  # outputs to dist/, served by Flask

# Linting / formatting / type checking (requires: uv sync --extra dev)
uv run ruff check .
uv run ruff format .
uv run ty check
```

Note: the Vite proxy targets port 3000, so run the backend with `PORT=3000 uv run server.py` during frontend development.

## Architecture

### Data Model (`baza.py`)

Four models with these relationships:

- **Category** — self-referential parent/child hierarchy. Linked to both Worksheet and ExerciseSet via many-to-many junction tables (`category_to_worksheet`, `category_to_exercise_set`).
- **Worksheet** — a named word list (`ime` field = Slovene for "name"). Has many Translations (one-to-many, cascade delete).
- **Translation** — an English↔Slovene word pair, belongs to one Worksheet.
- **ExerciseSet** → **Exercise** — a set of fill-in-the-blank exercises (one-to-many, cascade delete). Each Exercise has `sentence_template` with a blank and `missing_word` as the answer.

All models have a `.dump()` method returning a JSON-serializable dict and a `.get()` static for find-or-create lookups.

### Backend (`server.py`, `config.py`)

- `config.py` creates the Flask app and initializes SQLAlchemy.
- `server.py` defines all REST endpoints and serves the Vue SPA for non-API 404s (SPA routing fallback).
- API responses use `json.dumps()` directly (not `jsonify`). The `@returns_json` decorator sets the content type.
- No authentication — the admin routes are unprotected.
- No database migrations — `db.create_all()` runs on startup. Schema changes require manual intervention or recreating the DB.

### API Endpoints

| Resource | GET | POST/PUT | DELETE |
|---|---|---|---|
| `/api/worksheets[/<id>]` | list / detail | create / update | `/api/worksheets/<id>/delete` (GET) |
| `/api/categories[/<id>]` | list / detail | create | `/api/categories/<id>/delete` (POST) |
| `/api/words` | list all translations | — | — |
| `/api/exercises[/<id>]` | list / detail | create / update | `/api/exercises/<id>/delete` (POST) |
| `/api/exercise-sets[/<id>]` | list / detail | create / update | `/api/exercise-sets/<id>/delete` (POST) |
| `/api/exercises/validate` | — | check answer | — |

Note: worksheet delete uses GET method (legacy); others use POST.

### Frontend (`anchy-english-vue/`)

- **Router** (`src/router/index.js`): Public routes (`/`, `/worksheets/:id`, `/word-practice`, `/exercise-sets`, `/exercise-sets/:id/practice`) and admin routes under `/admin` with `AdminLayout` wrapper.
- **API layer** (`src/api/`): `worksheets.js`, `words.js`, `categories.js` — axios-based API clients.
- **Views**: `PublicWorksheetList`, `WorksheetSolve`, `WordPracticeList`, `ExerciseSetList` (public); `WorksheetList`, `WorksheetEdit`, `Categories` (admin).
- **Components**: `WordDisplay`, `ExerciseSetPractice`, `FillInTheBlankExercise`.
- Uses `createWebHistory` (HTML5 history mode) — requires the Flask 404 fallback to serve `index.html`.
