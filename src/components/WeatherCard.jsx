import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudOff, CloudSun, Wind, CloudFog, Thermometer, Eye } from 'lucide-react'
import { getWeatherIcon } from '../utils/formatters'

const iconMap = {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudOff, CloudSun, Wind, CloudFog,
}

export default function WeatherCard({ weather }) {
  const forecast = weather?.HeWeather6?.[0]?.daily_forecast?.[0]
  if (!forecast) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Weather</h2>
        <p className="text-gray-500 text-sm">No weather data available</p>
      </div>
    )
  }

  const iconName = getWeatherIcon(forecast.cond_txt_d)
  const WeatherIcon = iconMap[iconName] || Cloud

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Weather</h2>

      <div className="flex items-center gap-4 mb-4">
        <WeatherIcon className="w-10 h-10 text-solar-yellow" />
        <div>
          <p className="text-gray-100 font-medium">{forecast.cond_txt_d}</p>
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
