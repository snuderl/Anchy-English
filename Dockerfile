FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN uv python install
ADD pyproject.toml uv.lock ./
RUN uv sync
ADD . /

CMD ["uv","run", "granian", "--interface", "wsgi", "server:app", "--host", "0.0.0.0"]
