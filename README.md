# Anchy English - Vocabulary Learning Application

An interactive English-Slovene vocabulary learning application that helps users create, organize, and practice with vocabulary worksheets.

## Features

- **Worksheet Management**: Create and organize vocabulary worksheets
- **Category Organization**: Group worksheets by categories (e.g., "Basic Vocabulary")
- **Interactive Learning**: Practice vocabulary with interactive exercises
- **Translation Management**: Add and manage English-Slovene word pairs
- **Print Support**: Print worksheets for offline practice

## Technology Stack

- **Backend**: Flask (Python) with SQLAlchemy ORM
- **Frontend**: AngularJS 1.x with Tailwind CSS
- **Database**: SQLite (local) or PostgreSQL (production via DATABASE_URL)
- **Package Management**: uv for Python dependencies

## Project Structure

```
├── server.py              # Main Flask application with REST API endpoints
├── config.py              # Flask app configuration and database initialization
├── baza.py               # SQLAlchemy models (Translation, Worksheet, Category)
├── web/                  # Frontend AngularJS application
│   ├── js/
│   │   ├── app.js        # Main Angular module and routing
│   │   ├── controllers/  # Angular controllers for different views
│   │   └── services.js   # Angular services for API communication
│   ├── partials/         # HTML templates for different routes
│   └── lib/              # AngularJS framework files
├── templates/            # Flask templates
└── instance/
    └── baza.sqlite       # SQLite database (created automatically)
```

## Quick Start

### Prerequisites

- Python 3.12+ (specified in pyproject.toml)
- uv package manager

### Installation & Setup

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Run the development server:**
   ```bash
   uv run server.py
   ```
   
   The application will be available at:
   - Default: `http://localhost:8080`
   - Custom port: `PORT=3000 uv run server.py`

3. **Access the application:**
   - Navigate to the server URL
   - You'll be redirected to `/vaje` (the main application entry point)

### Database

- SQLite database is automatically created on first run via `db.create_all()` in `server.py`
- Database file: `instance/baza.sqlite`
- No migrations configured - schema changes require manual intervention

## API Endpoints

- `GET/POST /api/worksheets` - CRUD operations for worksheets
- `GET/POST /api/categories` - Category management
- `GET /api/words` - Translation word management
- `GET /vaje` - Main application entry point (serves AngularJS app)

## Development

### Running Tests

```bash
# Run Python tests
pytest

# Check test configuration
cat pytest.ini
```

### Production Deployment

The application is configured for Heroku-style deployments:

```bash
# Uses Procfile with: gunicorn server:app
# Set DATABASE_URL environment variable for PostgreSQL in production
```

## Usage

1. **Create Worksheets**: Use "Nov list" to create new vocabulary worksheets
2. **Organize by Categories**: Group related worksheets using the category system
3. **Practice Vocabulary**: Use interactive exercises with English-Slovene word pairs
4. **Print Worksheets**: Generate printable versions for offline practice

## Key Features

- **Multilingual**: Supports English-Slovene vocabulary translation
- **Interactive UI**: Modern interface with Tailwind CSS styling
- **Legacy Support**: Built on stable AngularJS 1.x framework
- **Flexible Database**: SQLite for development, PostgreSQL for production
- **No Build Tools**: Static files served directly by Flask (no webpack/npm required)

## Contributing

The application uses a simple architecture without modern build tools for easy maintenance and deployment.

## License

See LICENSE file for details.