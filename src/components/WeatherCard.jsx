import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudOff, CloudSun, Wind, CloudFog, Thermometer, Eye } from 'lucide-react'
import { getWeatherIcon } from '../utils/formatters'
import { useLanguage } from '../context/LanguageContext'

const iconMap = {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudOff, CloudSun, Wind, CloudFog,
}

function translateCondition(condText, t) {
  if (!condText) return condText
  const lower = condText.toLowerCase()
  // Match most specific first, then general
  if (lower.includes('thunderstorm') || lower.includes('thunder storm')) return t('weather_thunderstorm')
  if (lower.includes('thunder') || lower.includes('storm')) return t('weather_thunder')
  if (lower.includes('heavy rain')) return t('weather_heavyRain')
  if (lower.includes('light rain')) return t('weather_lightRain')
  if (lower.includes('shower')) return t('weather_shower')
  if (lower.includes('drizzle')) return t('weather_drizzle')
  if (lower.includes('rain')) return t('weather_rain')
  if (lower.includes('sleet')) return t('weather_sleet')
  if (lower.includes('heavy snow')) return t('weather_heavySnow')
  if (lower.includes('light snow')) return t('weather_lightSnow')
  if (lower.includes('snow')) return t('weather_snow')
  if (lower.includes('fog')) return t('weather_fog')
  if (lower.includes('mist')) return t('weather_mist')
  if (lower.includes('haze')) return t('weather_haze')
  if (lower.includes('overcast')) return t('weather_overcast')
  if (lower.includes('partly') || lower.includes('mostly cloud')) return t('weather_partlyCloudy')
  if (lower.includes('cloud')) return t('weather_cloudy')
  if (lower.includes('sunny')) return t('weather_sunny')
  if (lower.includes('clear')) return t('weather_clear')
  if (lower.includes('wind')) return t('weather_wind')
  return condText // fallback to API string if no match
}

export default function WeatherCard({ weather }) {
  const { t } = useLanguage()
  const forecast = weather?.HeWeather6?.[0]?.daily_forecast?.[0]
  if (!forecast) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">{t('weather_title')}</h2>
        <p className="text-gray-500 text-sm">{t('weather_noData')}</p>
      </div>
    )
  }

  const iconName = getWeatherIcon(forecast.cond_txt_d)
  const WeatherIcon = iconMap[iconName] || Cloud

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">{t('weather_title')}</h2>

      <div className="flex items-center gap-4 mb-4">
        <WeatherIcon className="w-10 h-10 text-solar-yellow" />
        <div>
          <p className="text-gray-100 font-medium">{translateCondition(forecast.cond_txt_d, t)}</p>
          <p className="text-gray-400 text-sm">{forecast.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">
            {forecast.tmp_min}° / {forecast.tmp_max}°C
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">
            {forecast.wind_dir} {forecast.wind_spd} km/h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">
            UV: {forecast.uv_index}
          </span>
        </div>
      </div>
    </div>
  )
}
