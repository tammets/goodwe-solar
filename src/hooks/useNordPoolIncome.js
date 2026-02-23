import { useState, useEffect, useMemo } from 'react'
import { fetchNordPoolPrices, aggregateHourlyPrices, calculateSpotIncome, estimateSpotIncome } from '../utils/nordpool'
import { getTodayDate, getSunTimes } from '../utils/formatters'

const SELLING_FEE_KEY = 'goodwe-solar-selling-fee'
const DEFAULT_SELLING_FEE = 0.018

function getStoredSellingFee() {
  try {
    const saved = localStorage.getItem(SELLING_FEE_KEY)
    return saved != null ? Number(saved) : DEFAULT_SELLING_FEE
  } catch {
    return DEFAULT_SELLING_FEE
  }
}

export function useNordPoolIncome(proxyUrl, chartData, todayKwh, latitude) {
  const [hourlyPrices, setHourlyPrices] = useState(null)
  const [spotError, setSpotError] = useState(null)
  const [sellingFee, setSellingFee] = useState(getStoredSellingFee)

  const dateStr = getTodayDate()

  useEffect(() => {
    if (!proxyUrl) return
    let cancelled = false

    fetchNordPoolPrices(proxyUrl, dateStr)
      .then(prices15min => {
        if (!cancelled) {
          setHourlyPrices(aggregateHourlyPrices(prices15min))
        }
      })
      .catch(err => {
        if (!cancelled) setSpotError(err.message)
      })

    return () => { cancelled = true }
  }, [proxyUrl, dateStr])

  const sunTimes = useMemo(() => latitude != null ? getSunTimes(latitude) : null, [latitude])

  const spotIncome = useMemo(() => {
    if (!hourlyPrices) return null
    // Use detailed power curve calculation if available, otherwise estimate from total kWh
    if (chartData?.length) {
      return calculateSpotIncome(chartData, hourlyPrices, sellingFee, dateStr)
    }
    if (todayKwh) {
      return estimateSpotIncome(todayKwh, hourlyPrices, sellingFee, sunTimes)
    }
    return calculateSpotIncome([], hourlyPrices, sellingFee, dateStr)
  }, [chartData, todayKwh, hourlyPrices, sellingFee, dateStr, sunTimes])

  const updateSellingFee = (newFee) => {
    localStorage.setItem(SELLING_FEE_KEY, String(newFee))
    setSellingFee(newFee)
  }

  return { spotIncome, hourlyPrices, spotError, sellingFee, updateSellingFee }
}
