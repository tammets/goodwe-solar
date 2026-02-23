import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { useMemo } from 'react'

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const price = payload[0]?.value
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-gray-300 text-sm">{label}:00</p>
      <p className="text-solar-yellow font-semibold">{price?.toFixed(2)} €/MWh</p>
      <p className="text-gray-400 text-xs">{(price / 1000 * 100).toFixed(2)} cents/kWh</p>
    </div>
  )
}

export default function SpotPriceChart({ hourlyPrices }) {
  const { chartData, currentHour, avgPrice } = useMemo(() => {
    if (!hourlyPrices?.size) return { chartData: [], currentHour: -1, avgPrice: 0 }

    const now = new Date().getHours()
    const data = []
    let sum = 0
    let count = 0

    for (let h = 0; h < 24; h++) {
      const price = hourlyPrices.get(h)
      if (price != null) {
        data.push({ hour: String(h).padStart(2, '0'), price })
        sum += price
        count++
      }
    }

    return {
      chartData: data,
      currentHour: now,
      avgPrice: count > 0 ? sum / count : 0,
    }
  }, [hourlyPrices])

  if (!chartData.length) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Today's Spot Price</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No price data available
        </div>
      </div>
    )
  }

  const currentPrice = hourlyPrices.get(currentHour)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Today's Spot Price</h2>
        <span className="text-sm text-gray-400">
          Now: <span className="text-solar-yellow font-medium">{currentPrice?.toFixed(1)} €/MWh</span>
          {' | '}Avg: <span className="text-gray-300">{avgPrice.toFixed(1)}</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis
            dataKey="hour"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
            label={{ value: '€/MWh', position: 'insideTopLeft', fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip content={<PriceTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <ReferenceLine y={avgPrice} stroke="#6B7280" strokeDasharray="4 4" />
          <Bar dataKey="price" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => {
              const h = Number(entry.hour)
              const isCurrent = h === currentHour
              const isPast = h < currentHour
              return (
                <Cell
                  key={i}
                  fill={isCurrent ? '#EAB308' : isPast ? '#CA8A04' : '#854D0E'}
                  opacity={isCurrent ? 1 : isPast ? 0.8 : 0.4}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
