import { MapPin, Building, Calendar, Wallet, Cpu } from 'lucide-react'
import { formatDate, formatCurrency } from '../utils/formatters'

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

export default function PlantInfo({ info, kpi }) {
  if (!info) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">Plant Info</h2>

      <div className="divide-y divide-gray-800">
        <InfoRow
          icon={Cpu}
          label="System Capacity"
          value={`${info.capacity} kW`}
        />
        <InfoRow
          icon={MapPin}
          label="Location"
          value={info.address}
        />
        <InfoRow
          icon={Building}
          label="Installer"
          value={info.org_name}
        />
        <InfoRow
          icon={Calendar}
          label="Online Since"
          value={formatDate(info.turnon_time)}
        />
        <InfoRow
          icon={Wallet}
          label="Total Income"
          value={formatCurrency(kpi?.total_income, kpi?.currency)}
        />
      </div>
    </div>
  )
}
