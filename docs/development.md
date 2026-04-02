# Development Guide

This document outlines how to set up and develop the Astro website locally.

## Prerequisites

- Node.js version `22.12.0` or higher
- npm (Node Package Manager)

## Local Setup

1. **Clone the repository** to your local machine.

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *We use `npm` for this project based on the lockfile configuration.*

## Running the Application

To start the local development server:

```bash
npm run dev
```

The application will be available at [http://localhost:4321](http://localhost:4321) by default. The Astro development server also provides Hot Module Replacement (HMR), so it will automatically update as you make changes to files.

## Project Structure Overview

- `src/`: Contains all source files for the application.
  - `pages/`: File-based routing for Astro.
  - `components/`: Reusable UI components (React, Astro).
  - `layouts/`: Common page layout templates.
  - `i18n/`: Internationalization utilities and configuration.
- `public/`: Static assets (images, fonts) served directly at the root.
- `astro.config.mjs`: The core Astro configuration file.
- `package.json`: Project dependencies and command scripts.
- `docs/`: Documentation describing the project workflow.

## Building for Production Locally

To test the production build locally before deploying:

1. **Create a production build**:
   ```bash
   npm run build
   ```
   *This outputs your compiled static site into the `dist/` directory.*

2. **Preview the generated build**:
   ```bash
   npm run preview
   ```
   *This will run a local web server to serve the contents of the `dist/` directory, allowing you to catch any production-specific issues early.*
