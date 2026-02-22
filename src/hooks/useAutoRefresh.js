import { useEffect, useRef } from 'react'

export function useAutoRefresh(refreshFn, isAuthenticated) {
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const getInterval = () => {
      const hour = new Date().getHours()
      // Daytime (7am-9pm): every 5 minutes; Night: every 30 minutes
      return (hour >= 7 && hour < 21) ? 5 * 60 * 1000 : 30 * 60 * 1000
    }

    const scheduleNext = () => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        refreshFn()
        scheduleNext()
      }, getInterval())
    }

    scheduleNext()
    return () => clearTimeout(timeoutRef.current)
  }, [refreshFn, isAuthenticated])
}
