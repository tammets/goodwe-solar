import { Zap, Sun, Calendar, BarChart3, DollarSign, Activity, Moon } from 'lucide-react'
import { formatPower, formatEnergy, formatCurrency, getInverterStatus, isNightTime } from '../utils/formatters'
import { useLanguage } from '../context/LanguageContext'

function StatusCard({ icon: Icon, label, value, unit, accent, pulse, subtitle }) {
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
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

export default function StatusCards({ kpi, info, spotIncome }) {
  const { t } = useLanguage()
  const status = getInverterStatus(info?.status)
  const pac = kpi?.pac || 0
  const isSleeping = isNightTime() && info?.status !== 1

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-400">{t('status_currentPower')}</span>
        </div>
        {isSleeping ? (
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-solar-yellow" />
            <span className="text-sm text-gray-400">{t('status_panelsSleeping')}</span>
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
        label={t('status_today')}
        value={formatEnergy(kpi?.power)}
        unit="kWh"
        accent="text-solar-green"
      />
      <StatusCard
        icon={Calendar}
        label={t('status_thisMonth')}
        value={formatEnergy(kpi?.month_generation)}
        unit="kWh"
      />
      <StatusCard
        icon={BarChart3}
        label={t('status_lifetime')}
        value={formatEnergy(kpi?.total_power)}
        unit="kWh"
      />
      <StatusCard
        icon={DollarSign}
        label={t('status_todaysIncome')}
        value={spotIncome
          ? formatCurrency(spotIncome.totalIncome, 'EUR')
          : formatCurrency(kpi?.day_income, kpi?.currency)}
        accent="text-solar-yellow"
        subtitle={spotIncome?.currentSpotPrice != null
          ? `${t('status_spotNow')} ${spotIncome.currentSpotPrice.toFixed(1)} | ${t('status_spotAvg')} ${spotIncome.avgPrice.toFixed(1)} €/MWh`
          : !spotIncome ? t('status_goodweEstimate') : null}
      />
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-400">{t('status_inverter')}</span>
        </div>
        <span className={`inline-block px-2.5 py-1 rounded-full text-sm font-medium ${status.color}/20 ${status.textColor}`}>
          {t(status.labelKey)}
        </span>
      </div>
    </div>
  )
}
