import { useState, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { getTodayDate } from '../utils/formatters'

const RANGE_OPTIONS = [
  { value: 1, label: 'Day' },
  { value: 2, label: 'Month' },
  { value: 3, label: 'Year' },
]

function HistoryTooltip({ active, payload, label, range }) {
  if (!active || !payload?.length) return null
  const unit = range === 1 ? 'kW' : 'kWh'
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-gray-300 text-sm">{label}</p>
      <p className="text-solar-green font-semibold">{payload[0].value.toFixed(2)} {unit}</p>
    </div>
  )
}

export default function HistoryView({ fetchHistory }) {
  const [range, setRange] = useState(1)
  const [date, setDate] = useState(getTodayDate())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadData = useCallback(async (newDate, newRange) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchHistory(newDate, newRange)
      setData(result)
    } catch (err) {
      setError(err.message || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [fetchHistory])

  const handleRangeChange = (newRange) => {
    setRange(newRange)
    loadData(date, newRange)
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setDate(newDate)
    loadData(newDate, range)
  }

  const inputType = range === 3 ? 'number' : range === 2 ? 'month' : 'date'
  const yLabel = range === 1 ? 'kW' : 'kWh'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-100">History</h2>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleRangeChange(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  range === opt.value
                    ? 'bg-solar-green text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {range === 3 ? (
            <input
              type="number"
              value={date.slice(0, 4)}
              onChange={(e) => {
                const newDate = `${e.target.value}-01-01`
                setDate(newDate)
                loadData(newDate, range)
              }}
              min="2020"
              max="2030"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-solar-green w-24"
            />
          ) : (
            <input
              type={inputType}
              value={range === 2 ? date.slice(0, 7) : date}
              onChange={handleDateChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-solar-green [color-scheme:dark]"
            />
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="skeleton h-full w-full" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          {data === null ? 'Select a date to view history' : 'No data for this period'}
        </div>
      ) : range === 1 ? (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: yLabel, position: 'insideTopLeft', fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip content={<HistoryTooltip range={range} />} />
            <Area type="monotone" dataKey="power" stroke="#22C55E" fill="url(#historyGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} label={{ value: yLabel, position: 'insideTopLeft', fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip content={<HistoryTooltip range={range} />} />
            <Bar dataKey="power" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
