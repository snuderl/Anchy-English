# Anchy English - Vue Frontend

This is the Vue 3 frontend for the Anchy English vocabulary learning application. It provides an interactive interface for creating and practicing with vocabulary worksheets.

## Features

- **Interactive Worksheets**: Create and manage English-Slovene vocabulary worksheets
- **Character-by-Character Practice**: Individual input boxes for each letter with visual feedback
- **Category Management**: Organize worksheets by categories
- **Modern Vue 3**: Built with Vue 3 Composition API and `<script setup>` syntax
- **Responsive Design**: Tailwind CSS for modern, responsive styling

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

- `src/components/` - Reusable Vue components
- `src/views/` - Page components for different routes
- `src/api/` - API communication modules
- `src/router/` - Vue Router configuration
- `src/main.js` - Application entry point

## Key Components

- **WordDisplay.vue** - Interactive word practice component with individual character inputs
- **WorksheetEdit.vue** - Worksheet creation and editing interface
- **WordAutocomplete.vue** - Autocomplete component for word input
