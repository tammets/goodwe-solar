import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import { useMemo } from 'react'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-gray-300 text-sm">{label}</p>
      <p className="text-solar-green font-semibold">{payload[0].value.toFixed(2)} kW</p>
    </div>
  )
}

export default function PowerChart({ data }) {
  const peak = useMemo(() => {
    if (!data?.length) return null
    return data.reduce((max, d) => (d.power > (max?.power || 0) ? d : max), null)
  }, [data])

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
        <AreaChart data={data}>
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
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#4B5563' }}
            tickFormatter={(v) => `${v}`}
            label={{ value: 'kW', position: 'insideTopLeft', fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="power"
            stroke="#22C55E"
            fill="url(#powerGradient)"
            strokeWidth={2}
          />
          {peak && peak.power > 0 && (
            <ReferenceDot
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
