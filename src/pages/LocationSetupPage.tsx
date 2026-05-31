import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Check, Loader2, ChevronDown } from 'lucide-react'
import {
  fetchRegions,
  fetchProvinces,
  fetchCitiesByRegion,
  fetchCitiesByProvince,
  fetchBarangays,
  getCostLevel,
  NO_PROVINCE_REGIONS,
  type PsgcItem,
} from '../services/locationApiService'
import { COST_LEVEL_CONFIG } from '../data/costLevels'
import { useUserProfile } from '../context/UserProfileContext'
import { useAuth } from '../context/AuthContext'

export default function LocationSetupPage() {
  const { user } = useAuth()
  const { updateLocation } = useUserProfile()
  const navigate = useNavigate()

  const [regions, setRegions] = useState<PsgcItem[]>([])
  const [provinces, setProvinces] = useState<PsgcItem[]>([])
  const [cities, setCities] = useState<PsgcItem[]>([])
  const [barangays, setBarangays] = useState<PsgcItem[]>([])

  const [regionCode, setRegionCode] = useState('')
  const [provinceCode, setProvinceCode] = useState('')
  const [cityCode, setCityCode] = useState('')
  const [barangayCode, setBarangayCode] = useState('')

  const [regionName, setRegionName] = useState('')
  const [provinceName, setProvinceName] = useState('')
  const [cityName, setCityName] = useState('')
  const [barangayName, setBarangayName] = useState('')

  const [loadingRegions, setLoadingRegions] = useState(true)
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingBarangays, setLoadingBarangays] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const noProvince = NO_PROVINCE_REGIONS.has(regionCode)

  // Fetch regions on mount
  useEffect(() => {
    fetchRegions()
      .then(data => setRegions(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setError('Hindi ma-load ang listahan ng rehiyon. I-check ang internet.'))
      .finally(() => setLoadingRegions(false))
  }, [])

  // When region changes → fetch provinces or cities directly
  useEffect(() => {
    if (!regionCode) return
    setProvinces([])
    setCities([])
    setBarangays([])
    setProvinceCode('')
    setCityCode('')
    setBarangayCode('')
    setProvinceName('')
    setCityName('')
    setBarangayName('')

    if (NO_PROVINCE_REGIONS.has(regionCode)) {
      setLoadingCities(true)
      fetchCitiesByRegion(regionCode)
        .then(data => setCities(data.sort((a, b) => a.name.localeCompare(b.name))))
        .catch(() => setError('Hindi ma-load ang mga lungsod. Subukan ulit.'))
        .finally(() => setLoadingCities(false))
    } else {
      setLoadingProvinces(true)
      fetchProvinces(regionCode)
        .then(data => setProvinces(data.sort((a, b) => a.name.localeCompare(b.name))))
        .catch(() => setError('Hindi ma-load ang mga probinsya. Subukan ulit.'))
        .finally(() => setLoadingProvinces(false))
    }
  }, [regionCode])

  // When province changes → fetch cities
  useEffect(() => {
    if (!provinceCode || noProvince) return
    setCities([])
    setBarangays([])
    setCityCode('')
    setBarangayCode('')
    setCityName('')
    setBarangayName('')

    setLoadingCities(true)
    fetchCitiesByProvince(provinceCode)
      .then(data => setCities(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setError('Hindi ma-load ang mga lungsod. Subukan ulit.'))
      .finally(() => setLoadingCities(false))
  }, [provinceCode])

  // When city changes → fetch barangays
  useEffect(() => {
    if (!cityCode) return
    setBarangays([])
    setBarangayCode('')
    setBarangayName('')

    setLoadingBarangays(true)
    fetchBarangays(cityCode)
      .then(data => setBarangays(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setBarangays([]))
      .finally(() => setLoadingBarangays(false))
  }, [cityCode])

  const costLevel = getCostLevel(regionCode, cityName)
  const costConfig = COST_LEVEL_CONFIG[costLevel]

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!regionCode) { setError('Piliin ang iyong rehiyon.'); return }
    if (!noProvince && !provinceCode) { setError('Piliin ang iyong probinsya.'); return }
    if (!cityCode) { setError('Piliin ang iyong lungsod o bayan.'); return }

    setSaving(true)
    try {
      const fullCity = barangayName
        ? `Brgy. ${barangayName}, ${cityName}`
        : cityName

      await updateLocation(regionCode, regionName, fullCity, costLevel)
      navigate('/', { replace: true })
    } catch {
      setError('May error sa pag-save. Subukan ulit.')
    } finally {
      setSaving(false)
    }
  }

  const canSave = regionCode && (noProvince || provinceCode) && cityCode

  return (
    <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2d6a4f] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={22} className="text-white" />
          </div>
          <h1 className="font-extrabold text-[#1a1a1a] text-2xl tracking-tight mb-1">
            Saan ka nakatira?
          </h1>
          <p className="text-[#6b5e52] text-sm max-w-xs mx-auto leading-relaxed">
            Para mas relevant ang iyong mga tips — iba ang cost of living sa bawat lugar sa Pilipinas.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e8ddd0] p-6 shadow-sm space-y-4">

          {/* Region */}
          <SelectField
            label="Rehiyon"
            value={regionCode}
            loading={loadingRegions}
            disabled={loadingRegions}
            placeholder="Piliin ang Rehiyon"
            onChange={val => {
              const r = regions.find(r => r.code === val)
              setRegionCode(val)
              setRegionName(r?.name ?? '')
              setError('')
            }}
            options={regions}
          />

          {/* Province — hidden for NCR */}
          {regionCode && !noProvince && (
            <SelectField
              label="Probinsya"
              value={provinceCode}
              loading={loadingProvinces}
              disabled={loadingProvinces || !regionCode}
              placeholder="Piliin ang Probinsya"
              onChange={val => {
                const p = provinces.find(p => p.code === val)
                setProvinceCode(val)
                setProvinceName(p?.name ?? '')
                setError('')
              }}
              options={provinces}
            />
          )}

          {/* City / Municipality */}
          {(noProvince ? regionCode : provinceCode) && (
            <SelectField
              label="Lungsod / Bayan"
              value={cityCode}
              loading={loadingCities}
              disabled={loadingCities}
              placeholder="Piliin ang Lungsod o Bayan"
              onChange={val => {
                const c = cities.find(c => c.code === val)
                setCityCode(val)
                setCityName(c?.name ?? '')
                setError('')
              }}
              options={cities}
            />
          )}

          {/* Barangay */}
          {cityCode && (
            <SelectField
              label="Barangay"
              labelSuffix="(optional)"
              value={barangayCode}
              loading={loadingBarangays}
              disabled={loadingBarangays}
              placeholder={loadingBarangays ? 'Nilo-load...' : 'Piliin ang Barangay'}
              onChange={val => {
                const b = barangays.find(b => b.code === val)
                setBarangayCode(val)
                setBarangayName(b?.name ?? '')
              }}
              options={barangays}
              allowEmpty
            />
          )}

          {/* Cost level preview */}
          {cityCode && (
            <div
              className="rounded-xl px-4 py-3 border flex items-center gap-3 animate-float-up"
              style={{ background: costConfig.bg, borderColor: costConfig.border }}
            >
              <div className="shrink-0 text-base">
                {costLevel === 'high' ? '💸' : costLevel === 'medium' ? '⚖️' : '💚'}
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: costConfig.color }}>
                  {costConfig.label}
                </p>
                <p className="text-[#6b5e52] text-xs leading-snug mt-0.5">{costConfig.tip}</p>
              </div>
            </div>
          )}

          {error && (
            <p className="text-[#e85d4a] text-xs font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving || !canSave}
            className="w-full flex items-center justify-center gap-2 bg-[#2d6a4f] hover:bg-[#1e5c42] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-2"
          >
            {saving
              ? <><Loader2 size={15} className="animate-spin" /> Sine-save...</>
              : <><Check size={15} /> I-save ang Location</>
            }
          </button>
        </form>

        {/* Summary */}
        {cityCode && (
          <p className="text-center text-[#a89880] text-xs mt-3">
            📍 {[barangayName && `Brgy. ${barangayName}`, cityName, provinceName, regionName]
              .filter(Boolean).join(', ')}
          </p>
        )}

        {user && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="text-[#a89880] text-xs hover:text-[#6b5e52] underline underline-offset-2 transition-colors"
            >
              I-skip muna, gagawin ko later
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

interface SelectFieldProps {
  label: string
  labelSuffix?: string
  value: string
  loading: boolean
  disabled: boolean
  placeholder: string
  options: PsgcItem[]
  onChange: (val: string) => void
  allowEmpty?: boolean
}

function SelectField({
  label, labelSuffix, value, loading, disabled,
  placeholder, options, onChange, allowEmpty = false,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#6b5e52] uppercase tracking-wider mb-1.5">
        {label}{' '}
        {labelSuffix && <span className="text-[#a89880] font-normal normal-case">{labelSuffix}</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full appearance-none bg-[#faf6f0] border border-[#e8ddd0] rounded-xl px-4 py-3 pr-10 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {loading ? 'Nilo-load...' : placeholder}
          </option>
          {allowEmpty && <option value="">— Wala / I-skip —</option>}
          {options.map(o => (
            <option key={o.code} value={o.code}>{o.name}</option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading
            ? <Loader2 size={14} className="text-[#a89880] animate-spin" />
            : <ChevronDown size={15} className="text-[#a89880]" />
          }
        </div>
      </div>
    </div>
  )
}
