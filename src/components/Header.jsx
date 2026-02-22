import { Sun, RefreshCw, LogOut, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatDateTime } from '../utils/formatters'

export default function Header({ lastUpdated, onRefresh, refreshing, sellingFee, onSellingFeeChange }) {
  const { logout } = useAuth()
  const [showSettings, setShowSettings] = useState(false)
  const settingsRef = useRef(null)

  useEffect(() => {
    if (!showSettings) return
    function handleClick(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showSettings])

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sun className="w-7 h-7 text-solar-yellow" />
          <h1 className="text-xl font-bold text-gray-100">GoodWe Solar Monitor</h1>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 hidden sm:block">
              Updated: {formatDateTime(lastUpdated)}
            </span>
          )}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-50">
                <label className="block text-sm text-gray-300 mb-1">
                  Selling fee (EUR/kWh)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  max="0.1"
                  value={sellingFee}
                  onChange={(e) => onSellingFeeChange(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-solar-green"
                />
                <p className="text-xs text-gray-500 mt-1">Enefit default: 0.018 EUR/kWh</p>
              </div>
            )}
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
