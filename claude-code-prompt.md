# GoodWe Solar Monitor — Full Claude Code Prompt

## Copy everything below this line into Claude Code:

---

Build a static single-page solar monitoring app for my GoodWe QW10KT-DT inverter
that will be hosted on GitHub Pages.

## Tech Stack
- React (Vite) with static build output
- Tailwind CSS for styling
- Recharts for charts
- No backend — all API calls go through a Cloudflare Worker CORS proxy

## CORS Proxy

All SEMS API calls must go through my Cloudflare Worker proxy at:
https://sems-proxy.tammets.workers.dev/

Instead of calling the SEMS API directly, the app POSTs to the proxy like this:

```javascript
const response = await fetch('https://sems-proxy.tammets.workers.dev/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: '<actual SEMS API endpoint>',
    headers: { 'Content-Type': 'application/json', 'Token': '...' },
    body: { ... }
  })
});
const data = await response.json();
```

## SEMS API Details (tested and verified)

### CRITICAL API QUIRKS — READ CAREFULLY
- EU accounts: CrossLogin does NOT return an `api` field. Hardcode fallback: `https://eu.semsportal.com/api`
- Response `code` is a STRING `"0"`, not number `0`. Always compare with `String(res.code) === '0'`
- The response wrapper is: `{ "code": "0", "msg": "操作成功", "data": {...} }`
- `kpi.pac` is in watts (integer). `kpi.power`, `kpi.month_generation`, `kpi.total_power` are in kWh (float)
- Currency and income data: `kpi.currency` ("EUR"), `kpi.yield_rate` (€/kWh), `kpi.day_income`, `kpi.total_income`
- Weather is nested in `data.weather.HeWeather6[0].daily_forecast[]`
- Plant capacity is in `data.info.capacity` (kW, e.g. 10.65)
- The Token header value is a JSON string, not a Bearer token

### Step 1: Authentication (CrossLogin)
```
POST https://www.semsportal.com/api/v1/Common/CrossLogin
Headers:
  Content-Type: application/json
  Token: {"version":"v2.1.0","client":"ios","language":"en"}
Body:
  {"account":"<email>","pwd":"<password>"}
```

Response:
```json
{
  "code": "0",
  "msg": "操作成功",
  "data": {
    "uid": "68ce2427-39ee-423e-9303-583e3d3b35d1",
    "timestamp": 1771754305791,
    "token": "3734acda33a8b277a393c743daaa208f",
    "client": "ios",
    "version": "v2.1.0",
    "language": "en"
  }
}
```

Note: there is NO `api` field in the response for EU accounts.
Use `https://eu.semsportal.com/api` as the API base URL.

### Step 2: Authenticated requests
All subsequent requests use this Token header:
```json
{"version":"v2.1.0","client":"ios","language":"en","timestamp":"<from_auth>","uid":"<from_auth>","token":"<from_auth>"}
```

### Step 3: Get plant overview
```
POST https://eu.semsportal.com/api/v2/PowerStation/GetMonitorDetailByPowerstationId
Body: {"powerStationId":"<station_id>"}
```

Actual response structure:
```json
{
  "code": "0",
  "data": {
    "info": {
      "powerstation_id": "f12061d2-9400-483a-9b97-0f38cea25c00",
      "time": "02/22/2026 11:58:26",
      "stationname": "Priit Tammets",
      "address": "Alle, Pudisoo, 74626 Harju maakond, Estonia",
      "capacity": 10.65,
      "status": 1,
      "turnon_time": "05/24/2022 00:00:00",
      "org_name": "Naps Solar Estonia Oü",
      "powerstation_type": "Residential",
      "has_pv": true,
      "longitude": 25.559585745359072,
      "latitude": 59.51953576237639
    },
    "kpi": {
      "pac": 358,
      "power": 0.6,
      "month_generation": 61.6,
      "total_power": 557.3,
      "day_income": 0.09,
      "total_income": 83.59,
      "yield_rate": 0.15,
      "currency": "EUR"
    },
    "weather": {
      "HeWeather6": [{
        "daily_forecast": [{
          "cond_txt_d": "Snow Flurry",
          "tmp_min": "-9",
          "tmp_max": "-2",
          "wind_dir": "WNW",
          "wind_spd": "17",
          "uv_index": "1",
          "date": "2026-02-22"
        }]
      }]
    }
  }
}
```

### Step 4: Chart data
```
POST https://eu.semsportal.com/api/v2/Charts/GetChartByPlant
Body: {"id":"<station_id>","date":"2026-02-22","range":1}
```
Range: 1=day, 2=month, 3=year
Response contains `data.lines[]` where each line has `xy[]` array of `{x, y}` points.

### Step 5: Inverter details
```
POST https://eu.semsportal.com/api/v2/PowerStationMonitor/GetPowerStationInverterList
Body: {"powerStationId":"<station_id>"}
```

## Credentials Handling

Since this is a static app, credentials can NOT be hardcoded.
Implement a login screen as the first page:
- Fields: Email, Password, Power Station ID
- The proxy URL should be pre-filled with https://sems-proxy.tammets.workers.dev/ but editable
- A "Remember me" checkbox that stores credentials in localStorage
  (show a warning that this stores credentials in plaintext in the browser)
- After successful auth, store the token in React state
- Show the dashboard only after successful login
- Add a logout button that clears everything
- Token expires after ~30 min — auto-refresh silently in the background

## Dashboard Features

1. **Status card row** (top):
   - Current power output (kW) — large, prominent, with a pulse animation when producing
   - Today's generation (kWh)
   - This month's generation (kWh)
   - Total lifetime generation (kWh)
   - Today's income (EUR)
   - Inverter status badge (Online / Offline / Standby) based on `data.info.status` (1=online)

2. **Today's power curve** (main chart):
   - Area chart: time (x) vs power in kW (y)
   - Green gradient fill under the curve
   - Show peak power as an annotation
   - Auto-refresh every 5 minutes during daytime (7am-9pm), every 30 min at night
   - Manual refresh button

3. **Weather card**:
   - Show today's weather from `data.weather.HeWeather6[0].daily_forecast[0]`
   - Condition text, temperature range, wind, UV index
   - Simple weather icon based on cond_txt_d

4. **Plant info card**:
   - System capacity (10.65 kW)
   - Location
   - Installer name
   - Online since date
   - Total income earned

5. **Inverter details** (collapsible panel):
   - Per-phase voltage, current, frequency (if available from inverter list endpoint)
   - PV1/PV2 DC voltage and current
   - Inverter temperature
   - If the endpoint doesn't return details, show basic info from overview

6. **Historical view**:
   - Date picker to select a day — shows power curve
   - Toggle to month view — bar chart of daily totals
   - Toggle to year view — bar chart of monthly totals

7. **Last updated timestamp** — show when data was last refreshed

## Design
- Dark theme (bg-gray-950 / bg-gray-900 cards, not pure black)
- Primary accent: #22C55E (green-500) for power and generation values
- Secondary accent: #EAB308 (yellow-500) for solar/income references
- Text: gray-100 for primary, gray-400 for secondary
- Cards: bg-gray-900 with border-gray-800, rounded-xl, subtle shadow
- Responsive — single column on mobile, grid on desktop
- Clean, minimal, no clutter
- Use a sun icon (☀️ or lucide-react Sun icon) in the header
- When inverter is offline at night, show a "Panels sleeping 🌙" state instead of 0
- CSS transitions on number changes
- Loading skeleton states while fetching data

## Build Configuration
- Configure vite.config.js with `base: '/solar-monitor/'` for GitHub Pages
  (assuming repo name is "solar-monitor" — make this easy to change)
- Output dir: dist
- Add a GitHub Actions workflow at `.github/workflows/deploy.yml` that:
  1. Triggers on push to main
  2. Installs deps, builds
  3. Deploys dist/ to GitHub Pages

## Project Structure
```
solar-monitor/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── favicon.svg          (sun icon)
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css             (tailwind imports + dark theme defaults)
│   ├── components/
│   │   ├── LoginScreen.jsx
│   │   ├── Dashboard.jsx
│   │   ├── StatusCards.jsx
│   │   ├── PowerChart.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── PlantInfo.jsx
│   │   ├── InverterDetails.jsx
│   │   ├── HistoryView.jsx
│   │   └── Header.jsx
│   ├── hooks/
│   │   ├── useSemsApi.js      (auth + data fetching via proxy)
│   │   └── useAutoRefresh.js  (smart polling: frequent by day, slow at night)
│   └── utils/
│       ├── api.js             (proxy fetch wrapper)
│       └── formatters.js      (kW formatting, date helpers, EUR formatting)
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Important Implementation Notes
- All SEMS API calls go through the proxy: POST to proxy URL with {url, headers, body}
- Always check `String(response.code) === '0'` — never use strict === with number 0
- The API base URL is hardcoded to `https://eu.semsportal.com/api` (no need to detect)
- `kpi.pac` is watts → divide by 1000 for kW display
- Handle null/undefined gracefully — the API returns sparse data at night
- The Token header is a JSON string, not Bearer auth
- Add error boundaries and user-friendly error messages
- Include a "How to find your Station ID" help tooltip on the login screen
