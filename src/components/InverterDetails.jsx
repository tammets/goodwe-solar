import { useState } from 'react'
import { ChevronDown, Cpu } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function DetailRow({ label, value, unit }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-gray-200 text-sm font-medium">
        {value != null ? value : '—'}
        {unit && value != null && <span className="text-gray-500 ml-1">{unit}</span>}
      </span>
    </div>
  )
}

export default function InverterDetails({ data }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  if (!data) return null

  // Handle both array and single inverter responses
  const inverters = Array.isArray(data) ? data : data?.inverters || data?.data || []
  const inv = inverters[0] || data

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-100">{t('inverter_title')}</h2>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-800 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AC Output */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">{t('inverter_acOutput')}</h3>
              <div className="divide-y divide-gray-800">
                <DetailRow label={t('inverter_phaseAVolt')} value={inv.vac1 ?? inv.vacr} unit="V" />
                <DetailRow label={t('inverter_phaseBVolt')} value={inv.vac2 ?? inv.vacs} unit="V" />
                <DetailRow label={t('inverter_phaseCVolt')} value={inv.vac3 ?? inv.vact} unit="V" />
                <DetailRow label={t('inverter_phaseACurr')} value={inv.iac1 ?? inv.iacr} unit="A" />
                <DetailRow label={t('inverter_phaseBCurr')} value={inv.iac2 ?? inv.iacs} unit="A" />
                <DetailRow label={t('inverter_phaseCCurr')} value={inv.iac3 ?? inv.iact} unit="A" />
                <DetailRow label={t('inverter_frequency')} value={inv.fac} unit="Hz" />
              </div>
            </div>

            {/* DC Input */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">{t('inverter_dcInput')}</h3>
              <div className="divide-y divide-gray-800">
                <DetailRow label={t('inverter_pv1Voltage')} value={inv.vpv1} unit="V" />
                <DetailRow label={t('inverter_pv1Current')} value={inv.ipv1} unit="A" />
                <DetailRow label={t('inverter_pv2Voltage')} value={inv.vpv2} unit="V" />
                <DetailRow label={t('inverter_pv2Current')} value={inv.ipv2} unit="A" />
                <DetailRow label={t('inverter_pv3Voltage')} value={inv.vpv3} unit="V" />
                <DetailRow label={t('inverter_pv3Current')} value={inv.ipv3} unit="A" />
              </div>
            </div>

            {/* General */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">{t('inverter_general')}</h3>
              <div className="divide-y divide-gray-800">
                <DetailRow label={t('inverter_temperature')} value={inv.tempperature ?? inv.temperature} unit="°C" />
                <DetailRow label={t('inverter_power')} value={inv.pac} unit="W" />
                <DetailRow label={t('inverter_model')} value={inv.model_type ?? inv.sn} />
                <DetailRow label={t('inverter_firmware')} value={inv.firmware_version ?? inv.fw_version} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
