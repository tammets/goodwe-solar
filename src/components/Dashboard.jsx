import { useAuth } from '../context/AuthContext'
import { useSemsApi } from '../hooks/useSemsApi'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { useNordPoolIncome } from '../hooks/useNordPoolIncome'
import Header from './Header'
import StatusCards from './StatusCards'
import PowerChart from './PowerChart'
import WeatherCard from './WeatherCard'
import PlantInfo from './PlantInfo'
import InverterDetails from './InverterDetails'
import HistoryView from './HistoryView'
import { DashboardSkeleton } from './LoadingSkeleton'

export default function Dashboard() {
  const { auth, credentials } = useAuth()
  const { plantData, chartData, inverterData, loading, error, refresh, fetchHistory } = useSemsApi()
  useAutoRefresh(refresh, auth.isAuthenticated)
  const { spotIncome, hourlyPrices, sellingFee, updateSellingFee } = useNordPoolIncome(credentials.proxyUrl, chartData)

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        lastUpdated={plantData?.info?.time}
        onRefresh={refresh}
        refreshing={loading && !!plantData}
        sellingFee={sellingFee}
        onSellingFeeChange={updateSellingFee}
      />

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refresh} className="text-red-300 hover:text-red-100 underline text-sm">
              Retry
            </button>
          </div>
        </div>
      )}

      {loading && !plantData ? (
        <DashboardSkeleton />
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <StatusCards kpi={plantData?.kpi} info={plantData?.info} spotIncome={spotIncome} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PowerChart data={chartData} hourlyPrices={hourlyPrices} />
            </div>
            <div className="space-y-6">
              <WeatherCard weather={plantData?.weather} />
              <PlantInfo info={plantData?.info} />
            </div>
          </div>

          <InverterDetails data={inverterData} />
          <HistoryView fetchHistory={fetchHistory} />
        </main>
      )}
    </div>
  )
}
