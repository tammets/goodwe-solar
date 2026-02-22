import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import { useMemo } from 'react'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const power = payload.find(p => p.dataKey === 'power')
  const price = payload.find(p => p.dataKey === 'spotPrice')
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-gray-300 text-sm">{label}</p>
      {power && <p className="text-solar-green font-semibold">{power.value.toFixed(2)} kW</p>}
      {price?.value != null && <p className="text-solar-yellow font-semibold">{price.value.toFixed(1)} €/MWh</p>}
    </div>
  )
}

export default function PowerChart({ data, hourlyPrices }) {
  const peak = useMemo(() => {
    if (!data?.length) return null
    return data.reduce((max, d) => (d.power > (max?.power || 0) ? d : max), null)
  }, [data])

  const mergedData = useMemo(() => {
    if (!data?.length) return []
    if (!hourlyPrices?.size) return data

    return data.map(point => {
      const [h] = point.time.split(':').map(Number)
      return { ...point, spotPrice: hourlyPrices.get(h) ?? null }
    })
  }, [data, hourlyPrices])

  const priceRange = useMemo(() => {
    if (!hourlyPrices?.size) return null
    const values = [...hourlyPrices.values()]
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [hourlyPrices])

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Today's Power Curve</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Today's Power Curve</h2>
        {peak && peak.power > 0 && (
          <span className="text-sm text-gray-400">
            Peak: <span className="text-solar-green font-medium">{peak.power.toFixed(2)} kW</span> at {peak.time}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mergedData}>
          <defs>
            <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
          />
          <YAxis
            yAxisId="power"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
            tickFormatter={(v) => `${v}`}
            label={{ value: 'kW', position: 'insideTopLeft', fill: '#9CA3AF', fontSize: 12 }}
          />
          {priceRange && (
            <YAxis
              yAxisId="price"
              orientation="right"
              stroke="#EAB308"
              tick={{ fill: '#EAB308', fontSize: 11 }}
              tickLine={{ stroke: '#EAB308' }}
              domain={[Math.floor(priceRange.min * 0.8), Math.ceil(priceRange.max * 1.2)]}
              label={{ value: '€/MWh', position: 'insideTopRight', fill: '#EAB308', fontSize: 11 }}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="power"
            type="monotone"
            dataKey="power"
            stroke="#22C55E"
            fill="url(#powerGradient)"
            strokeWidth={2}
          />
          {priceRange && (
            <Line
              yAxisId="price"
              type="stepAfter"
              dataKey="spotPrice"
              stroke="#EAB308"
              strokeWidth={1.5}
              strokeOpacity={0.6}
              dot={false}
              connectNulls
            />
          )}
          {peak && peak.power > 0 && (
            <ReferenceDot
              yAxisId="power"
              x={peak.time}
              y={peak.power}
              r={4}
              fill="#22C55E"
              stroke="#fff"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
