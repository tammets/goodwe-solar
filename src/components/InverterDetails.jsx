import { useState } from 'react'
import { ChevronDown, Cpu } from 'lucide-react'

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
          <h2 className="text-lg font-semibold text-gray-100">Inverter Details</h2>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-800 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AC Output */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">AC Output</h3>
              <div className="divide-y divide-gray-800">
                <DetailRow label="Phase A Voltage" value={inv.vac1 ?? inv.vacr} unit="V" />
                <DetailRow label="Phase B Voltage" value={inv.vac2 ?? inv.vacs} unit="V" />
                <DetailRow label="Phase C Voltage" value={inv.vac3 ?? inv.vact} unit="V" />
                <DetailRow label="Phase A Current" value={inv.iac1 ?? inv.iacr} unit="A" />
                <DetailRow label="Phase B Current" value={inv.iac2 ?? inv.iacs} unit="A" />
                <DetailRow label="Phase C Current" value={inv.iac3 ?? inv.iact} unit="A" />
                <DetailRow label="Frequency" value={inv.fac} unit="Hz" />
              </div>
            </div>

            {/* DC Input */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">DC Input (PV Strings)</h3>
              <div className="divide-y divide-gray-800">
                <DetailRow label="PV1 Voltage" value={inv.vpv1} unit="V" />
                <DetailRow label="PV1 Current" value={inv.ipv1} unit="A" />
                <DetailRow label="PV2 Voltage" value={inv.vpv2} unit="V" />
                <DetailRow label="PV2 Current" value={inv.ipv2} unit="A" />
                <DetailRow label="PV3 Voltage" value={inv.vpv3} unit="V" />
                <DetailRow label="PV3 Current" value={inv.ipv3} unit="A" />
              </div>
            </div>

            {/* General */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">General</h3>
              <div className="divide-y divide-gray-800">
                <DetailRow label="Temperature" value={inv.tempperature ?? inv.temperature} unit="°C" />
                <DetailRow label="Power" value={inv.pac} unit="W" />
                <DetailRow label="Model" value={inv.model_type ?? inv.sn} />
                <DetailRow label="Firmware" value={inv.firmware_version ?? inv.fw_version} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
