import { MapPin, Building, Calendar, Cpu } from 'lucide-react'
import { formatDate } from '../utils/formatters'
import { useLanguage } from '../context/LanguageContext'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-200 break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function PlantInfo({ info }) {
  const { t } = useLanguage()
  if (!info) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">{t('plant_title')}</h2>

      <div className="divide-y divide-gray-800">
        <InfoRow
          icon={Cpu}
          label={t('plant_capacity')}
          value={`${info.capacity} kW`}
        />
        <InfoRow
          icon={MapPin}
          label={t('plant_location')}
          value={info.address}
        />
        <InfoRow
          icon={Building}
          label={t('plant_installer')}
          value={info.org_name}
        />
        <InfoRow
          icon={Calendar}
          label={t('plant_onlineSince')}
          value={formatDate(info.turnon_time)}
        />
      </div>
    </div>
  )
}
