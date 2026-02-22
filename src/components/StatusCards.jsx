import { Zap, Sun, Calendar, BarChart3, DollarSign, Activity, Moon } from 'lucide-react'
import { formatPower, formatEnergy, formatCurrency, getInverterStatus, isNightTime } from '../utils/formatters'

function StatusCard({ icon: Icon, label, value, unit, accent, pulse }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold transition-numbers ${accent || 'text-gray-100'} ${pulse ? 'animate-power-pulse' : ''}`}>
        {value}
        {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
      </div>
    </div>
  )
}

export default function StatusCards({ kpi, info }) {
  const status = getInverterStatus(info?.status)
  const pac = kpi?.pac || 0
  const isSleeping = isNightTime() && info?.status !== 1

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-400">Current Power</span>
        </div>
        {isSleeping ? (
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-solar-yellow" />
            <span className="text-sm text-gray-400">Panels sleeping</span>
          </div>
        ) : (
          <div className={`text-2xl font-bold transition-numbers text-solar-green ${pac > 0 ? 'animate-power-pulse' : ''}`}>
            {formatPower(pac)}
            <span className="text-sm font-normal text-gray-400 ml-1">kW</span>
          </div>
        )}
      </div>

      <StatusCard
        icon={Sun}
        label="Today"
        value={formatEnergy(kpi?.power)}
        unit="kWh"
        accent="text-solar-green"
      />
      <StatusCard
        icon={Calendar}
        label="This Month"
        value={formatEnergy(kpi?.month_generation)}
        unit="kWh"
      />
      <StatusCard
        icon={BarChart3}
        label="Lifetime"
        value={formatEnergy(kpi?.total_power)}
        unit="kWh"
      />
      <StatusCard
        icon={DollarSign}
        label="Today's Income"
        value={formatCurrency(kpi?.day_income, kpi?.currency)}
        accent="text-solar-yellow"
      />
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-400">Inverter</span>
        </div>
        <span className={`inline-block px-2.5 py-1 rounded-full text-sm font-medium ${status.color}/20 ${status.textColor}`}>
          {status.label}
        </span>
      </div>
    </div>
  )
}
