IMAGE := snuderl/anchy-english
TAG   := latest

.PHONY: build push lint lint-be lint-fe

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

lint-fe: ## Frontend: vue build check
	cd anchy-english-vue && pnpm run build
