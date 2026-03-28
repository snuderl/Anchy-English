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
- **Frontend**: Vue 3 with Tailwind CSS
- **Build Tool**: Vite for modern frontend development
- **Database**: SQLite (local) or PostgreSQL (production via DATABASE_URL)
- **Package Management**: uv for Python, pnpm for Vue dependencies

## Project Structure

```
├── server.py              # Main Flask application with REST API endpoints
├── config.py              # Flask app configuration and database initialization
├── baza.py               # SQLAlchemy models (Translation, Worksheet, Category)
├── anchy-english-vue/    # Frontend Vue 3 application
│   ├── src/
│   │   ├── main.js       # Vue application entry point
│   │   ├── App.vue       # Root Vue component
│   │   ├── components/   # Reusable Vue components
│   │   ├── views/        # Vue components for different routes
│   │   ├── api/          # API communication modules
│   │   └── router/       # Vue Router configuration
│   ├── public/           # Static assets
│   ├── dist/             # Built production files (generated)
│   ├── package.json      # Node.js dependencies
│   └── vite.config.js    # Vite build configuration
└── instance/
    └── baza.sqlite       # SQLite database (created automatically)
```

## Quick Start

### Prerequisites

- Python 3.13+ (specified in pyproject.toml)
- Node.js 18+ (for Vue frontend)
- uv package manager for Python
- pnpm for Vue dependencies

### Installation & Setup

#### Option 1: Production Mode (Recommended)

1. **Install Python dependencies:**
   ```bash
   uv sync
   ```

2. **Install Vue dependencies and build:**
   ```bash
   cd anchy-english-vue
   pnpm install
   pnpm run build
   cd ..
   ```

3. **Run the server:**
   ```bash
   uv run server.py
   ```
   
   The application will be available at `http://localhost:8080`

#### Option 2: Development Mode (with hot reload)

1. **Install all dependencies:**
   ```bash
   # Python dependencies
   uv sync
   
   # Vue dependencies  
   cd anchy-english-vue
   pnpm install
   cd ..
   ```

2. **Run backend and frontend separately:**
   ```bash
   # Terminal 1: Flask backend (port 3000 so Vite proxy works)
   PORT=3000 uv run server.py
   
   # Terminal 2: Vue dev server (in anchy-english-vue/)
   cd anchy-english-vue
   pnpm run dev
   ```
   
   - Backend API: `http://localhost:3000`
   - Vue dev server: `http://localhost:5173` (with hot reload, proxies /api → :3000)

### Database

- SQLite database is automatically created on first run via `db.create_all()` in `server.py`
- Database file: `instance/baza.sqlite`
- No migrations configured - schema changes require manual intervention

## API Endpoints

- `GET/POST /api/worksheets` - CRUD operations for worksheets
- `GET/POST /api/categories` - Category management
- `GET /api/words` - Translation word management
- `GET/POST /api/exercise-sets` - Exercise set management
- `GET/POST /api/exercises` - Individual exercise management
- `POST /api/exercises/validate` - Check exercise answers
- `GET /` - Main application entry point (serves Vue app)

## Development

### Production Deployment

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
- **Interactive UI**: Modern interface with Vue 3 and Tailwind CSS
- **Modern Architecture**: Built with Vue 3 Composition API and Vite
- **Individual Input Boxes**: Character-by-character typing practice with visual feedback
- **Flexible Database**: SQLite for development, PostgreSQL for production
- **SPA Routing**: Single Page Application with Vue Router for smooth navigation

## Contributing

The application uses modern Vue 3 with Vite for the frontend and Flask for the backend. The architecture is designed for maintainability and easy deployment with Docker support.

## License

See LICENSE file for details.