const API_BASE = 'https://eu.semsportal.com/api'

const INITIAL_TOKEN = JSON.stringify({
  version: 'v2.1.0',
  client: 'ios',
  language: 'en',
})

function buildAuthToken(authData) {
  return JSON.stringify({
    version: 'v2.1.0',
    client: 'ios',
    language: 'en',
    timestamp: String(authData.timestamp),
    uid: authData.uid,
    token: authData.token,
  })
}

async function proxyFetch(proxyUrl, url, headers, body) {
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, headers, body }),
  })

  if (!res.ok) {
    throw new Error(`Proxy request failed: ${res.status}`)
  }

  const data = await res.json()

  // CRITICAL: API returns code as STRING "0", not number 0
  if (String(data.code) !== '0') {
    const msg = data.msg || 'API request failed'
    const error = new Error(msg)
    error.code = data.code
    throw error
  }

  return data.data
}

export async function crossLogin(proxyUrl, email, password) {
  return proxyFetch(
    proxyUrl,
    'https://www.semsportal.com/api/v1/Common/CrossLogin',
    { 'Content-Type': 'application/json', Token: INITIAL_TOKEN },
    { account: email, pwd: password }
  )
}

export async function getPlantOverview(proxyUrl, authData, stationId) {
  return proxyFetch(
    proxyUrl,
    `${API_BASE}/v2/PowerStation/GetMonitorDetailByPowerstationId`,
    { 'Content-Type': 'application/json', Token: buildAuthToken(authData) },
    { powerStationId: stationId }
  )
}

export async function getChartData(proxyUrl, authData, stationId, date, range = 1) {
  return proxyFetch(
    proxyUrl,
    `${API_BASE}/v2/Charts/GetChartByPlant`,
    { 'Content-Type': 'application/json', Token: buildAuthToken(authData) },
    { id: stationId, date, range }
  )
}

export async function getInverterList(proxyUrl, authData, stationId) {
  return proxyFetch(
    proxyUrl,
    `${API_BASE}/v2/PowerStationMonitor/GetPowerStationInverterList`,
    { 'Content-Type': 'application/json', Token: buildAuthToken(authData) },
    { powerStationId: stationId }
  )
}
