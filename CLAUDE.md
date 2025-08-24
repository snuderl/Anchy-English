# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an English-Slovene vocabulary learning application built with:
- **Backend**: Flask (Python) with SQLAlchemy ORM
- **Frontend**: Vue 3 with Tailwind CSS
- **Database**: SQLite (local) or PostgreSQL (production via DATABASE_URL)
- **Package Management**: uv for Python dependencies

## Architecture

### Backend Structure
- `server.py`: Main Flask application with REST API endpoints
- `baza.py`: SQLAlchemy models (Translation, Worksheet, Category)
- `config.py`: Flask app configuration and database initialization
- Database models use Flask-SQLAlchemy with relationships between worksheets, translations, and categories

### Frontend Structure
- `anchy-english-vue/`: Vue 3 application directory
  - `src/main.js`: Main Vue application entry point
  - `src/components/`: Reusable Vue components
  - `src/views/`: Vue components for different routes
  - `src/api/`: API communication modules
  - `src/router/`: Vue Router configuration

### API Endpoints
- `/api/worksheets`: CRUD operations for worksheets
- `/api/categories`: Category management
- `/api/words`: Translation word management

## Development Commands

### Running the Application

#### Development Mode (with Vue dev server)
```bash
# Install Python dependencies
uv sync

# Install Node.js dependencies for Vue
cd anchy-english-vue
npm install

# Run Flask backend (in one terminal)
uv run server.py

# Run Vue frontend dev server (in another terminal)
cd anchy-english-vue
npm run dev
```

#### Production Mode
```bash
# Build Vue app
cd anchy-english-vue
npm run build

# Run Flask server (serves Vue app from dist/)
uv run server.py

# The app will be available at http://localhost:8080 (default)
# For custom port: PORT=3000 uv run server.py
```

### Database Operations
```bash
# Database is automatically created on first run via db.create_all() in server.py
# SQLite database is stored at instance/baza.sqlite
```

### Production Deployment
```bash
# Uses Procfile for Heroku-style deployments
# Command: gunicorn server:app
# Set DATABASE_URL environment variable for PostgreSQL in production
```

## Key Technical Details

- Python version specified in runtime.txt (currently 3.7.9, though pyproject.toml requires >=3.12)
- Frontend uses Vue 3 with modern build tools (Vite)
- Built Vue app is served statically by Flask in production
- Database migrations are not configured - schema changes require manual intervention
- The application supports multilingual translations between English and Slovene
