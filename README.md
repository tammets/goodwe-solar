# GoodWe Solar Monitor

A static single-page web app for monitoring a GoodWe solar inverter in real-time. Connects to the SEMS Portal API and Elering Nord Pool API through a CORS proxy, displaying live production data, spot electricity prices, weather, and inverter details.

Hosted on GitHub Pages — no backend required.

![Dashboard screenshot](screenshot/screenshot.png)

## Features

- Real-time power output with auto-refresh (5 min day / 30 min night)
- Today, monthly, and lifetime generation stats
- Today's hourly spot price chart (Nord Pool via Elering API)
- Spot price income estimation using sunrise/sunset-aware daylight hours
- Weather conditions from SEMS API (translated to Estonian/English)
- Inverter details (AC phases, DC strings, temperature)
- Dark theme, responsive layout
- Bilingual UI — Estonian (default) and English, switchable via header toggle
- Login with SEMS Portal credentials, optional "remember me"
- Silent token refresh every 25 minutes

## Tech Stack

- React 19.2
- Vite 7
- Tailwind CSS 4
- Recharts 3
- Lucide React (icons)
- Cloudflare Worker CORS proxy

## Internationalization (i18n)

The app supports Estonian and English. Estonian is the default language. A language toggle button (EN/ET) is available in the header and on the login screen. The selected language is persisted in `localStorage`.

Translation files are located in `src/i18n/`:
- `et.js` — Estonian translations
- `en.js` — English translations

Weather conditions from the API are also translated via keyword matching.

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
