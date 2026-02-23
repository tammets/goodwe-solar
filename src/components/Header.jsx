import { Sun, RefreshCw, LogOut, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { formatDateTime } from '../utils/formatters'

export default function Header({ lastUpdated, onRefresh, refreshing, sellingFee, onSellingFeeChange }) {
  const { logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
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
          <h1 className="text-xl font-bold text-gray-100">{t('header_title')}</h1>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 hidden sm:block">
              {t('header_updated')} {formatDateTime(lastUpdated)}
            </span>
          )}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800"
              title={t('header_settings')}
            >
              <Settings className="w-5 h-5" />
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-50">
                <label className="block text-sm text-gray-300 mb-1">
                  {t('header_sellingFeeLabel')}
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
                <p className="text-xs text-gray-500 mt-1">{t('header_sellingFeeHint')}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setLanguage(language === 'et' ? 'en' : 'et')}
            className="px-2 py-1 text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800 uppercase tracking-wider"
            title={language === 'et' ? 'Switch to English' : 'Lülita eesti keelele'}
          >
            {language === 'et' ? 'EN' : 'ET'}
          </button>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-800"
            title={t('header_refresh')}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
            title={t('header_logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
