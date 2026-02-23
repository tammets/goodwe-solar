export function formatPower(watts) {
  if (watts == null || watts === 0) return '0'
  return (watts / 1000).toFixed(2)
}

export function formatEnergy(kwh) {
  if (kwh == null) return '0'
  return Number(kwh).toFixed(1)
}

export function formatCurrency(amount, currency = 'EUR') {
  if (amount == null) return `0.00 ${currency}`
  return `${Number(amount).toFixed(2)} ${currency}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  // SEMS format: "02/22/2026 11:58:26"
  const [datePart] = dateStr.split(' ')
  const [month, day, year] = datePart.split('/')
  return `${day}.${month}.${year}`
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  // SEMS format: "02/22/2026 11:58:26"
  const [datePart, timePart] = dateStr.split(' ')
  const [month, day, year] = datePart.split('/')
  return `${day}.${month}.${year} ${timePart}`
}

export function getInverterStatus(statusCode) {
  switch (statusCode) {
    case 1:
      return { label: 'Online', color: 'bg-solar-green', textColor: 'text-solar-green' }
    case 0:
      return { label: 'Offline', color: 'bg-red-500', textColor: 'text-red-500' }
    case -1:
      return { label: 'Standby', color: 'bg-solar-yellow', textColor: 'text-solar-yellow' }
    default:
      return { label: 'Unknown', color: 'bg-gray-500', textColor: 'text-gray-500' }
  }
}

/**
 * Calculate sunrise/sunset hours for a given latitude and date.
 * Uses the NOAA solar calculator simplified algorithm.
 * @param {number} lat - Latitude in degrees
 * @param {Date} [date] - Date (defaults to today)
 * @returns {{sunrise: number, sunset: number}} Hours as decimals (e.g. 7.5 = 07:30)
 */
export function getSunTimes(lat, date = new Date()) {
  const rad = Math.PI / 180
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10))
  const latRad = lat * rad
  const declRad = declination * rad
  const cosHourAngle = -Math.tan(latRad) * Math.tan(declRad)

  // Handle polar day/night
  if (cosHourAngle < -1) return { sunrise: 0, sunset: 24 }
  if (cosHourAngle > 1) return { sunrise: 12, sunset: 12 }

  const hourAngle = Math.acos(cosHourAngle) / rad
  const sunrise = 12 - hourAngle / 15
  const sunset = 12 + hourAngle / 15

  return {
    sunrise: Math.round(sunrise * 10) / 10,
    sunset: Math.round(sunset * 10) / 10,
  }
}

export function isNightTime(lat) {
  if (lat != null) {
    const { sunrise, sunset } = getSunTimes(lat)
    const hour = new Date().getHours() + new Date().getMinutes() / 60
    return hour < sunrise || hour >= sunset
  }
  const hour = new Date().getHours()
  return hour < 7 || hour >= 21
}

export function getTodayDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getWeatherIcon(condText) {
  if (!condText) return 'Cloud'
  const lower = condText.toLowerCase()
  if (lower.includes('sunny') || lower.includes('clear')) return 'Sun'
  if (lower.includes('snow')) return 'CloudSnow'
  if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) return 'CloudRain'
  if (lower.includes('thunder') || lower.includes('storm')) return 'CloudLightning'
  if (lower.includes('fog') || lower.includes('mist') || lower.includes('haze')) return 'CloudFog'
  if (lower.includes('overcast')) return 'CloudOff'
  if (lower.includes('cloud') || lower.includes('partly')) return 'CloudSun'
  if (lower.includes('wind')) return 'Wind'
  return 'Cloud'
}
