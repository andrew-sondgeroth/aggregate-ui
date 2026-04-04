# aggregate-ui

## Overview

Landing page, embeddable widget, and interactive map pages for the Aggregate API — a location intelligence REST API that aggregates Census, Weather, Tax, Crime, Cost, and Voting data by US ZIP code.

## Tech Stack

- Vite 8, React 19, TypeScript
- Tailwind CSS v4 (landing page and map pages)
- React Router v7 for client-side routing
- Leaflet + react-leaflet for interactive maps (CartoDB Dark Matter tiles)
- Widget uses plain CSS injected into shadow DOM (no Tailwind)

## Build & Run

```bash
npm run dev              # Dev server on port 5173
npm run build            # Build landing page → dist/
npm run build:widget     # Build widget → dist-widget/
npm run build:all        # Build both + copy widget into dist/widget/
npm run preview          # Preview production build
```

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing page | Hero, features, live demo, code examples, pricing |
| `/explore` | Explore page | Single ZIP lookup with ZCTA boundary on map + profile side panel |
| `/search` | Search page | Multi-criteria search with scored markers on map, click-to-profile |

## Project Structure

```
src/
  api/              — API client (AggregateApiClient) and TypeScript types mirroring aggregate-api DTOs
  landing/          — Landing page sections (Hero, Features, LiveDemo, CodeExample, Pricing, Footer)
    components/     — DataSourceBadge
  explore/          — Explore page (single ZIP map + profile)
    components/     — MapView, SidePanel, ProfileSummary
  search/           — Search page (multi-ZIP map + criteria builder)
    components/     — SearchMapView, SearchSidePanel, CriteriaBuilder
  shared/           — Shared across all pages
    components/     — ZipInput, ProfileCard, SidePanelContainer, ErrorBoundary, ErrorMessage
    hooks/          — useLocationProfile, useLocationSearch, useZctaBoundary, useZctaCentroids
    utils/          — formatters (currency, percent, number, temp, rate), zip-validation
  widget/           — Embeddable widget (separate Vite build in library/IIFE mode)
```

## Two Build Targets

1. **Landing page** (`vite.config.ts`) — Standard SPA → `dist/`
2. **Widget** (`vite.widget.config.ts`) — Library mode, IIFE format → `dist-widget/aggregate-widget.js`

The `build:all` script merges the widget into `dist/widget/` so a single static server serves everything. Explore and Search pages are code-split via `React.lazy`.

## Key Patterns

### API Client (`src/api/client.ts`)
- `AggregateApiClient` class with `getProfile(zip)`, `search(request)`, `getSearchFields()`
- `demoClient` singleton used by hooks when no custom base URL/key is provided
- Adds `X-API-Key` header from config

### Map Pages
- Both explore and search use the same map stack: `MapContainer` → `TileLayer` (CartoDB Dark Matter) → `GeoJSON`/`CircleMarker`
- ZIP code boundaries fetched from Census TIGERweb REST API (`PUMA_TAD_TAZ_UGA_ZCTA` layer 1, field `ZCTA5`)
- Centroids batch-fetched from TIGERweb with `returnGeometry=false` for search result markers
- Shared `SidePanelContainer`: left sidebar on desktop (400px), bottom sheet on mobile (<640px), collapsible
- `ProfileSummary` component shared between explore and search for displaying profile data

### Data Domains
All six domains are represented in types and UI:
- **Area** (Census): population, demographics, economic, housing, education, income distribution, affordability, internet, community risk
- **Climate** (Weather): annual summary, monthly breakdown, nearest station
- **Tax**: sales tax, income tax, excise tax, IRS stats
- **Crime**: violent crime, property crime, summary rates
- **Cost**: housing costs, fair market rents, price indices, affordability
- **Voting**: presidential elections, partisan summary, districts, state officials

## Widget Embedding

```html
<div id="aggregate-widget"></div>
<script src="https://your-domain/widget/aggregate-widget.js"></script>
<script>
  AggregateWidget.init({
    container: '#aggregate-widget',
    apiKey: 'your-api-key',
    theme: 'light',
    sections: ['area', 'climate', 'tax', 'crime', 'cost'],
    defaultZip: '90210',
  });
</script>
```

The widget renders into a shadow DOM for style isolation.

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Aggregate API URL | `https://aggregateapi-production.up.railway.app` |
| `VITE_DEMO_API_KEY` | API key for demo/explore/search | Fallback key hardcoded in client.ts |

## Deployment

Deployed on Railway via Docker. The Dockerfile builds both targets and serves static files with `serve -s` (SPA fallback for client-side routing).

## Conventions

- Dark modern aesthetic (Stripe/Vercel-style) — theme variables in `@theme` block in `src/index.css`
- Fonts: Instrument Serif (display), Sora (body), IBM Plex Mono (code)
- Colors: dark bg (#06090f), gold accent (#f0b429), blue/teal/red/green secondaries
- Widget CSS uses `aw-` prefix for all class names
- TypeScript types in `src/api/types.ts` mirror aggregate-api Java DTOs exactly
- Shared components in `src/shared/` are used by landing, explore, and search pages
- Accessibility: skip link, aria labels, focus-visible ring, sr-only utility, semantic landmarks
- Error boundary wraps all lazy-loaded routes
- Leaflet controls styled to match dark theme via CSS overrides in `src/index.css`
