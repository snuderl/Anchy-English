IMAGE := snuderl/anchy-english
TAG   := latest

.PHONY: dev setup build push lint lint-be lint-fe test

dev: ## Start Flask + Vite dev servers (single command)
	uv run honcho start -f Procfile.dev

setup: ## Install all dependencies
	uv sync
	cd anchy-english-vue && pnpm install

test: ## Run backend tests
	uv run pytest

build:
	docker build -t $(IMAGE):$(TAG) .

push: build
	docker push $(IMAGE):$(TAG)

# ── Linting ──────────────────────────────────────────────

lint: lint-be lint-fe ## Run all linters, formatters and type checks

lint-be: ## Backend: ruff check + format check + ty type check
	uv run ruff check .
	uv run ruff format --check .
	uv run ty check

lint-fe: ## Frontend: eslint + build check
	cd anchy-english-vue && pnpm run lint
	cd anchy-english-vue && pnpm run build
