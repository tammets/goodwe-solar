# GoodWe Solar Monitor

A static single-page web app for monitoring a GoodWe solar inverter in real-time. Connects to the SEMS Portal API through a CORS proxy and displays live production data, historical charts, weather, and inverter details.

Hosted on GitHub Pages — no backend required.

## Features

- Real-time power output with auto-refresh (5 min day / 30 min night)
- Today, monthly, and lifetime generation stats
- Daily power curve chart with peak annotation
- Historical view: day, month, and year charts
- Weather conditions from SEMS API
- Inverter details (AC phases, DC strings, temperature)
- Nord Pool spot price income tracking (via Elering API)
- Dark theme, responsive layout
- Login with SEMS Portal credentials, optional "remember me"
- Silent token refresh every 25 minutes

## Tech Stack

- React 19.2
- Vite 7
- Tailwind CSS 4
- Recharts 3
- Lucide React (icons)
- Cloudflare Worker CORS proxy

## Getting Started

### With Docker

```bash
docker compose up --build
```

Open http://localhost:5173

### Without Docker

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Configured for GitHub Pages deployment with `base: '/goodwe-solar/'`.

## Deployment

Pushes to `main` trigger automatic deployment to GitHub Pages via GitHub Actions.

Live at: https://tammets.github.io/goodwe-solar/

## CORS Proxy

All external API calls (SEMS Portal and Elering Nord Pool) go through a Cloudflare Worker CORS proxy. The proxy URL is configurable on the login screen.

## License

MIT
