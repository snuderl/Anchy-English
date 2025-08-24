# Stage 1: Build Vue frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY anchy-english-vue/package*.json ./
RUN npm ci
COPY anchy-english-vue/ ./
RUN npm run build

# Stage 2: Python application with Vue
FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install Python dependencies
RUN uv python install
COPY pyproject.toml uv.lock ./
RUN uv sync

# Copy Python application (excluding frontend source)
COPY *.py ./

# Copy built Vue assets from frontend-builder stage
COPY --from=frontend-builder /app/dist /app/anchy-english-vue/dist

# Expose port (default 8080)
EXPOSE 8080

# Production server
CMD ["uv", "run", "granian", "--interface", "wsgi", "server:app", "--host", "0.0.0.0", "--port", "8080"]
