import { useState, useEffect, useCallback } from 'react'
import { getPlantOverview, getChartData, getInverterList } from '../utils/api'
import { getTodayDate } from '../utils/formatters'
import { useAuth } from '../context/AuthContext'

export function useSemsApi() {
  const { auth, credentials, logout } = useAuth()
  const [plantData, setPlantData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [inverterData, setInverterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const authData = auth.isAuthenticated ? { uid: auth.uid, token: auth.token, timestamp: auth.timestamp } : null

  const refresh = useCallback(async () => {
    if (!authData || !credentials.stationId) return
    setLoading(true)
    setError(null)

    try {
      const [plant, chart, inverters] = await Promise.all([
        getPlantOverview(credentials.proxyUrl, authData, credentials.stationId),
        getChartData(credentials.proxyUrl, authData, credentials.stationId, getTodayDate(), 1),
        getInverterList(credentials.proxyUrl, authData, credentials.stationId).catch(() => null),
      ])

      setPlantData(plant)
      setInverterData(inverters)

      // Process chart data: extract first line's xy points
      if (chart?.lines?.length > 0) {
        const points = chart.lines[0].xy?.map((point) => ({
          time: point.x,
          power: Number(point.y) || 0,
        })) || []
        setChartData(points)
      } else {
        setChartData([])
      }
    } catch (err) {
      if (err.code === '-1' || err.message?.includes('token')) {
        logout()
      } else {
        setError(err.message || 'Failed to fetch data')
      }
    } finally {
      setLoading(false)
    }
  }, [authData?.token, credentials.stationId, credentials.proxyUrl, logout])

  const fetchHistory = useCallback(async (date, range) => {
    if (!authData || !credentials.stationId) return null
    try {
      const chart = await getChartData(credentials.proxyUrl, authData, credentials.stationId, date, range)
      if (chart?.lines?.length > 0) {
        return chart.lines[0].xy?.map((point) => ({
          time: point.x,
          power: Number(point.y) || 0,
        })) || []
      }
      return []
    } catch (err) {
      if (err.code === '-1') logout()
      throw err
    }
  }, [authData?.token, credentials.stationId, credentials.proxyUrl, logout])

  // Fetch on mount and when auth changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      refresh()
    }
  }, [auth.isAuthenticated, auth.token])

  return { plantData, chartData, inverterData, loading, error, refresh, fetchHistory }
}
