# aggregate-ui

## Overview

Landing page and embeddable widget for the Aggregate API — a location intelligence REST API that aggregates Census, Weather, Tax, and Crime data by ZIP code.

## Tech Stack

- Vite 8, React 19, TypeScript
- Tailwind CSS v4 (landing page only)
- No routing library (single-page, scroll-to-section)
- Widget uses plain CSS injected into shadow DOM (no Tailwind)

## Build & Run

```bash
npm run dev              # Dev server
npm run build            # Build landing page → dist/
npm run build:widget     # Build widget → dist-widget/
npm run build:all        # Build both + copy widget into dist/widget/
npm run preview          # Preview production build
```

## Project Structure

```
src/
  api/           — Shared API client and TypeScript types (mirrors aggregate-api DTOs)
  landing/       — Landing page sections and components
  widget/        — Embeddable widget (separate Vite build in library/IIFE mode)
  shared/        — Hooks and utilities shared between landing page and widget
```

## Two Build Targets

1. **Landing page** (`vite.config.ts`) — Standard SPA → `dist/`
2. **Widget** (`vite.widget.config.ts`) — Library mode, IIFE format → `dist-widget/aggregate-widget.js`

The `build:all` script merges the widget into `dist/widget/` so a single static server serves everything.

## Widget Embedding

```html
<div id="aggregate-widget"></div>
<script src="https://your-domain/widget/aggregate-widget.js"></script>
<script>
  AggregateWidget.init({
    container: '#aggregate-widget',
    apiKey: 'your-api-key',
    theme: 'light',
    sections: ['area', 'climate', 'tax', 'crime'],
    defaultZip: '90210',
  });
</script>
```

The widget renders into a shadow DOM for style isolation.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Aggregate API URL (default: `http://localhost:8080`) |
| `VITE_DEMO_API_KEY` | API key for the live demo section |

## Deployment

Deployed on Railway via Docker. The Dockerfile builds both targets and serves static files with `serve`.

## Conventions

- Dark modern aesthetic (Stripe/Vercel-style) for landing page
- CSS custom properties defined in `@theme` block in `src/index.css`
- Widget CSS uses `aw-` prefix for all class names
- TypeScript types in `src/api/types.ts` mirror aggregate-api Java DTOs exactly
