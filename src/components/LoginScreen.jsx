import { useState } from 'react'
import { Sun, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const { login, loginError, loginLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stationId, setStationId] = useState('')
  const [proxyUrl, setProxyUrl] = useState('https://sems-proxy.tammets.workers.dev/')
  const [rememberMe, setRememberMe] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password, stationId, proxyUrl, rememberMe)
    } catch {
      // Error is handled by AuthContext
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sun className="w-8 h-8 text-solar-yellow" />
          <h1 className="text-2xl font-bold text-gray-100">GoodWe Solar Monitor</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-solar-green transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-solar-green transition-colors"
              placeholder="SEMS Portal password"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm text-gray-400">Power Station ID</label>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            {showHelp && (
              <p className="text-xs text-solar-yellow mb-2">
                Find this in SEMS Portal &rarr; Plant Settings &rarr; look for the Plant ID (UUID format like f12061d2-9400-483a-9b97-0f38cea25c00)
              </p>
            )}
            <input
              type="text"
              required
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-solar-green transition-colors"
              placeholder="f12061d2-9400-483a-9b97-..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">CORS Proxy URL</label>
            <input
              type="url"
              required
              value={proxyUrl}
              onChange={(e) => setProxyUrl(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-solar-green transition-colors text-sm"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mt-1 accent-solar-green"
              />
              <span className="text-sm text-gray-400">
                Remember me
                {rememberMe && (
                  <span className="block text-xs text-solar-yellow mt-1">
                    Warning: Credentials will be stored in plaintext in your browser's localStorage
                  </span>
                )}
              </span>
            </label>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-solar-green hover:bg-solar-green-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginLoading ? 'Connecting...' : 'Connect to SEMS'}
          </button>
        </form>
      </div>
    </div>
  )
}
