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

export function isNightTime() {
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
