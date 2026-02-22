import { Sun, RefreshCw, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatDateTime } from '../utils/formatters'

export default function Header({ lastUpdated, onRefresh, refreshing }) {
  const { logout } = useAuth()

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
