# Testing Guide

This document describes how to start the app, make changes, and verify them — both manually and with automated tests. It's written for both human developers and AI coding agents.

---

## 1. Quick Start: Spinning Up the App

### One command (recommended)

```bash
make setup   # install all deps (one-time)
make dev     # start Flask + Vite together
```

This runs `honcho start -f Procfile.dev`, which reads `Procfile.dev`:

```
flask: PORT=3000 FLASK_DEBUG=1 uv run python -m app.server
vite: cd anchy-english-vue && pnpm run dev
```

[Honcho](https://github.com/nickstenning/honcho) is a Python process manager that spawns both commands, prefixes their output (`flask.1 |`, `vite.1 |`), and forwards Ctrl+C to shut both down cleanly.

Once running:
- **http://localhost:5173** — the app (Vite dev server, with HMR)
- **http://localhost:3000** — the API directly (Flask, auto-reloads on Python changes)

Vite proxies `/api/*` requests to Flask automatically.

### Production-like mode (single process, built assets)

```bash
cd anchy-english-vue && pnpm run build && cd ..
PORT=3000 uv run python -m app.server
# → http://localhost:3000 serves both API and built SPA
```

---

## 2. Reloading After Changes

| What changed | How to reload |
|---|---|
| **Vue component / CSS / JS** | Automatic — Vite HMR updates the browser instantly |
| **Vue router / new view** | Automatic via HMR; hard-refresh if routing seems stale |
| **Python code (server.py, baza.py, config.py)** | Restart the Flask process (`Ctrl-C` then re-run). Flask does **not** auto-reload by default. To enable: `FLASK_DEBUG=1 PORT=3000 uv run python -m app.server` |
| **Database schema (baza.py models)** | Delete `instance/baza.sqlite` and restart Flask — `db.create_all()` rebuilds tables. There are no migrations. |
| **Python deps (pyproject.toml)** | `uv sync` then restart Flask |
| **JS deps (package.json)** | `cd anchy-english-vue && pnpm install` then restart Vite |

---

## 3. Unit / Integration Tests (pytest)

Backend tests live in `tests/` and use Flask's test client with a temporary SQLite database.

```bash
# Run all tests
uv run pytest

# Run a specific test file
uv run pytest tests/test_api.py

# Run a single test
uv run pytest tests/test_api.py::TestWorksheetEndpoints::test_create_worksheet

# Verbose output
uv run pytest -v
```

Each test gets a **fresh database** (tables created/dropped per test via the `_reset_db` autouse fixture in `conftest.py`). No cleanup needed.

### Adding new tests

Put new test files in `tests/`. Use the existing fixtures from `conftest.py`:

- `client` — Flask test client for making HTTP requests
- `db_session` — SQLAlchemy session for direct DB manipulation
- `sample_data` — pre-populated categories, worksheets, translations
- `sample_worksheet`, `sample_category`, `sample_translation` — individual fixtures

---

## 4. Linting & Type Checking

```bash
uv run ruff check .      # lint
uv run ruff format .     # auto-format
uv run ty check          # type check (some SQLAlchemy quirks suppressed in pyproject.toml)
```

---

## 5. End-to-End Testing with Playwright

Playwright tests run a real browser against the running app. This is the best way to verify full user flows.

### Setup (one-time)

```bash
cd anchy-english-vue
pnpm add -D @playwright/test
npx playwright install --with-deps chromium
```

### Running E2E tests

**Prerequisites**: both backend and frontend must be running (see Section 1).

```bash
cd anchy-english-vue
npx playwright test
```

Or run headed (visible browser) for debugging:

```bash
npx playwright test --headed
```

### Writing E2E tests

Create test files in `anchy-english-vue/e2e/`. Example structure:

```
anchy-english-vue/
  e2e/
    worksheets.spec.js
    exercises.spec.js
    admin.spec.js
  playwright.config.js
```

#### Example: `playwright.config.js`

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'make dev',
    cwd: '..',
    port: 5173,
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
```

> With the `webServer` config, Playwright can auto-start both servers. Set `reuseExistingServer: true` so it uses already-running servers if present.

#### Example: `e2e/worksheets.spec.js`

```js
import { test, expect } from '@playwright/test';

test.describe('Public Worksheets', () => {
  test('homepage loads and shows worksheet list', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Anchy/i);
    // The public worksheet list should render
    await expect(page.locator('main')).toBeVisible();
  });

  test('can open a worksheet and see translations', async ({ page }) => {
    // Requires at least one worksheet in the DB
    await page.goto('/');
    const firstLink = page.locator('a[href*="/worksheets/"]').first();
    await firstLink.click();
    // Should show word pairs
    await expect(page.locator('body')).toContainText(/english|slovenian/i);
  });
});

test.describe('Admin - Worksheet CRUD', () => {
  test('can create a new worksheet', async ({ page }) => {
    await page.goto('/admin/worksheets');
    await page.click('text=New Worksheet');  // adjust selector to match UI
    await page.fill('input[name="name"]', 'Test Worksheet');
    // Add a word pair
    await page.fill('input[name="english"]', 'apple');
    await page.fill('input[name="slovene"]', 'jabolko');
    await page.click('text=Save');
    // Verify it appears in the list
    await expect(page.locator('body')).toContainText('Test Worksheet');
  });
});

test.describe('Exercise Sets', () => {
  test('can practice fill-in-the-blank exercises', async ({ page }) => {
    await page.goto('/exercise-sets');
    const firstLink = page.locator('a').first();
    await firstLink.click();
    // Should show an exercise input
    await expect(page.locator('input')).toBeVisible();
  });
});
```

> **Note:** Adjust selectors to match your actual UI. Use `npx playwright codegen http://localhost:5173` to interactively record selectors.

---

## 6. Key User Flows to Test

### Public flows

| Flow | Route | What to verify |
|---|---|---|
| Browse worksheets | `/` | Categories render, worksheets listed |
| Study a worksheet | `/worksheets/:id` | Word pairs (EN↔SL) display correctly |
| Word practice | `/word-practice` | Flash-card style practice works |
| Exercise sets list | `/exercise-sets` | Sets are listed with names |
| Practice exercises | `/exercise-sets/:id/practice` | Fill-in-the-blank input, submit, validation feedback |

### Admin flows

| Flow | Route | What to verify |
|---|---|---|
| List worksheets | `/admin/worksheets` | All worksheets shown |
| Create worksheet | `/admin/worksheets/new` | Name + word pairs saved, appears in list |
| Edit worksheet | `/admin/worksheets/:id` | Changes persist after save |
| Delete worksheet | `/admin/worksheets` (delete button) | Removed from list and DB |
| Manage categories | `/admin/categories` | Create, nest (parent/child), assign to worksheets |
| Create exercise set | `/admin/exercise-sets/new` | Set name + exercises saved |
| Edit exercise set | `/admin/exercise-sets/:id` | Changes persist |
| Delete exercise set | `/admin/exercise-sets` | Removed from list |

### API smoke tests (curl / test client)

```bash
# List worksheets
curl http://localhost:3000/api/worksheets

# Get single worksheet
curl http://localhost:3000/api/worksheets/1

# Create worksheet
curl -X POST http://localhost:3000/api/worksheets \
  -H 'Content-Type: application/json' \
  -d '{"ime": "Colors", "words": [{"english": "red", "slovene": "rdeča"}], "categories": []}'

# List categories
curl http://localhost:3000/api/categories

# Validate exercise answer
curl -X POST http://localhost:3000/api/exercises/validate \
  -H 'Content-Type: application/json' \
  -d '{"exercise_id": 1, "answer": "running"}'
```

---

## 7. Database Tips for Testing

The SQLite database lives at `instance/baza.sqlite`.

```bash
# Inspect the DB
sqlite3 instance/baza.sqlite ".tables"
sqlite3 instance/baza.sqlite "SELECT * FROM worksheet;"

# Reset the DB (nuke and recreate)
rm instance/baza.sqlite
# Restart Flask — db.create_all() rebuilds empty tables

# Seed sample data for manual/E2E testing
# Use the admin UI or curl commands above
```

For **automated E2E tests**, consider adding a `/api/test/reset` endpoint (behind an env flag) that drops and recreates all tables and optionally seeds data:

```python
# In server.py — only for testing!
if os.environ.get("TESTING"):
    @app.route("/api/test/reset", methods=["POST"])
    def reset_test_db():
        db.drop_all()
        db.create_all()
        # Optionally seed data here
        return {"ok": True}
```

Then in Playwright tests:

```js
test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});
```

---

## 8. Cheat Sheet

```bash
# === Setup & run ===
make setup                                 # install all deps
make dev                                   # start Flask + Vite

# === Tests ===
make test                                  # backend unit/integration
cd anchy-english-vue && npx playwright test # E2E (after setup)

# === Lint ===
make lint                                  # ruff + ty + eslint

# === Reset DB ===
rm -f instance/baza.sqlite  # then restart Flask
```
