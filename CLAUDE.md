# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an English-Slovene vocabulary learning application built with:
- **Backend**: Flask (Python) with SQLAlchemy ORM
- **Frontend**: AngularJS 1.x with Tailwind CSS
- **Database**: SQLite (local) or PostgreSQL (production via DATABASE_URL)
- **Package Management**: uv for Python dependencies

## Architecture

### Backend Structure
- `server.py`: Main Flask application with REST API endpoints
- `baza.py`: SQLAlchemy models (Translation, Worksheet, Category)
- `config.py`: Flask app configuration and database initialization
- Database models use Flask-SQLAlchemy with relationships between worksheets, translations, and categories

### Frontend Structure
- `web/`: AngularJS application directory
  - `js/app.js`: Main Angular module and routing configuration
  - `js/controllers/`: Individual controllers for different views
  - `js/services/`: Angular services for API communication
  - `partials/`: HTML templates for different routes
  - `lib/angular/`: AngularJS framework files

### API Endpoints
- `/api/worksheets`: CRUD operations for worksheets
- `/api/categories`: Category management
- `/api/words`: Translation word management
- `/vaje`: Main application entry point

## Development Commands

### Running the Application
```bash
uv sync

# Run Flask development server
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
- Frontend uses AngularJS 1.x (legacy version) with manual inclusion of framework files
- No modern build tools (webpack, npm, etc.) - static files served directly by Flask
- Database migrations are not configured - schema changes require manual intervention
- The application supports multilingual translations between English and Slovene
