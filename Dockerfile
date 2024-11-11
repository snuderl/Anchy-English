FROM python:3.12-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN uv python install 3.12
ADD pyproject.toml uv.lock ./
RUN uv sync
ADD . /

CMD ["uv","run", "granian", "--interface", "wsgi", "server:app"]
