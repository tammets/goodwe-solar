import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { crossLogin } from '../utils/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'goodwe-solar-credentials'
const REFRESH_INTERVAL = 25 * 60 * 1000 // 25 minutes

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ isAuthenticated: false })
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    stationId: '',
    proxyUrl: 'https://sems-proxy.tammets.workers.dev/',
  })
  const [loginError, setLoginError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const refreshTimerRef = useRef(null)

  const doLogin = useCallback(async (email, password, stationId, proxyUrl) => {
    const authData = await crossLogin(proxyUrl, email, password)
    setAuth({
      isAuthenticated: true,
      uid: authData.uid,
      token: authData.token,
      timestamp: authData.timestamp,
    })
    setCredentials({ email, password, stationId, proxyUrl })
    return authData
  }, [])

  const login = useCallback(async (email, password, stationId, proxyUrl, rememberMe) => {
    setLoginError(null)
    setLoginLoading(true)
    try {
      await doLogin(email, password, stationId, proxyUrl)
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password, stationId, proxyUrl }))
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed')
      throw err
    } finally {
      setLoginLoading(false)
    }
  }, [doLogin])

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false })
    setCredentials(prev => ({ ...prev, email: '', password: '' }))
    localStorage.removeItem(STORAGE_KEY)
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const refreshToken = useCallback(async () => {
    if (!credentials.email || !credentials.password) return
    try {
      await doLogin(credentials.email, credentials.password, credentials.stationId, credentials.proxyUrl)
    } catch {
      // Silent refresh failed — will retry next interval
    }
  }, [doLogin, credentials])

  // Auto-refresh token every 25 minutes
  useEffect(() => {
    if (!auth.isAuthenticated) return
    refreshTimerRef.current = setInterval(refreshToken, REFRESH_INTERVAL)
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
    }
  }, [auth.isAuthenticated, refreshToken])

  // Auto-login from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const { email, password, stationId, proxyUrl } = JSON.parse(saved)
      if (email && password && stationId) {
        setCredentials({ email, password, stationId, proxyUrl })
        setLoginLoading(true)
        doLogin(email, password, stationId, proxyUrl)
          .catch(() => {
            localStorage.removeItem(STORAGE_KEY)
          })
          .finally(() => setLoginLoading(false))
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [doLogin])

  return (
    <AuthContext.Provider value={{ auth, credentials, login, logout, loginError, loginLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
