const ELERING_API = 'https://dashboard.elering.ee/api/nps/price'

/**
 * Fetch today's Nord Pool spot prices for Estonia (15-min intervals).
 * Routed through CORS proxy (same as SEMS API).
 * @param {string} proxyUrl - CORS proxy URL
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {Promise<Array<{timestamp: number, price: number}>>}
 */
export async function fetchNordPoolPrices(proxyUrl, dateStr) {
  const startLocal = new Date(`${dateStr}T00:00:00`)
  const endLocal = new Date(`${dateStr}T23:59:59`)

  const params = new URLSearchParams({
    start: startLocal.toISOString(),
    end: endLocal.toISOString(),
  })

  const targetUrl = `${ELERING_API}?${params}`

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl, method: 'GET' }),
  })
  if (!res.ok) throw new Error(`Elering API error: ${res.status}`)

  const json = await res.json()
  if (!json.success || !json.data?.ee) throw new Error('Invalid Elering response')

  return json.data.ee
}

/**
 * Aggregate 15-min prices into hourly averages.
 * @param {Array<{timestamp: number, price: number}>} prices15min
 * @returns {Map<number, number>} hour (0-23) -> average price EUR/MWh
 */
export function aggregateHourlyPrices(prices15min) {
  const hourBuckets = new Map()

  for (const { timestamp, price } of prices15min) {
    const hour = new Date(timestamp * 1000).getHours()
    if (!hourBuckets.has(hour)) {
      hourBuckets.set(hour, [])
    }
    hourBuckets.get(hour).push(price)
  }

  const hourlyPrices = new Map()
  for (const [hour, prices] of hourBuckets) {
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length
    hourlyPrices.set(hour, Math.round(avg * 100) / 100)
  }

  return hourlyPrices
}

/**
 * Calculate today's income from power curve + hourly spot prices.
 * @param {Array<{time: string, power: number}>} powerPoints - from GoodWe chart
 * @param {Map<number, number>} hourlyPrices - hour -> EUR/MWh
 * @param {number} sellingFee - EUR/kWh fee (e.g. 0.018)
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {{totalIncome: number, totalEnergy: number, avgPrice: number, currentSpotPrice: number|null}}
 */
export function calculateSpotIncome(powerPoints, hourlyPrices, sellingFee = 0, dateStr) {
  if (!powerPoints?.length || !hourlyPrices?.size) {
    return { totalIncome: 0, totalEnergy: 0, avgPrice: 0, currentSpotPrice: null }
  }

  const pointsWithTimestamp = powerPoints.map(p => {
    const [hours, minutes] = p.time.split(':').map(Number)
    const d = new Date(`${dateStr}T00:00:00`)
    d.setHours(hours, minutes, 0, 0)
    return { unixSeconds: Math.floor(d.getTime() / 1000), hour: hours, power: p.power }
  })

  let totalIncome = 0
  let totalEnergy = 0
  let weightedPriceSum = 0

  for (let i = 1; i < pointsWithTimestamp.length; i++) {
    const prev = pointsWithTimestamp[i - 1]
    const curr = pointsWithTimestamp[i]

    const durationHours = (curr.unixSeconds - prev.unixSeconds) / 3600
    if (durationHours <= 0 || durationHours > 1) continue

    const avgPower = (prev.power + curr.power) / 2
    const energy = avgPower * durationHours

    const midHour = new Date(((prev.unixSeconds + curr.unixSeconds) / 2) * 1000).getHours()
    const spotPriceEurMwh = hourlyPrices.get(midHour) ?? 0
    const spotPriceEurKwh = spotPriceEurMwh / 1000

    const netPrice = spotPriceEurKwh - sellingFee
    totalIncome += energy * netPrice
    totalEnergy += energy
    weightedPriceSum += energy * spotPriceEurMwh
  }

  const avgPrice = totalEnergy > 0 ? weightedPriceSum / totalEnergy : 0
  const currentHour = new Date().getHours()
  const currentSpotPrice = hourlyPrices.get(currentHour) ?? null

  return {
    totalIncome: Math.round(totalIncome * 10000) / 10000,
    totalEnergy: Math.round(totalEnergy * 100) / 100,
    avgPrice: Math.round(avgPrice * 100) / 100,
    currentSpotPrice,
  }
}
