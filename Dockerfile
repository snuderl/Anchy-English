FROM python:3.12-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN uv python install 3.12
ADD . .
RUN uv sync

CMD ["uv", "run", "server.py"]
