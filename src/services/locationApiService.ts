const BASE = 'https://psgc.cloud/api'

export interface PsgcItem {
  code: string
  name: string
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`PSGC API error: ${res.status}`)
  return res.json()
}

export const fetchRegions = () => get<PsgcItem[]>('/regions')

export const fetchProvinces = (regionCode: string) =>
  get<PsgcItem[]>(`/regions/${regionCode}/provinces`)

// NCR and some regions have no provinces — cities are directly under the region
export const fetchCitiesByRegion = (regionCode: string) =>
  get<PsgcItem[]>(`/regions/${regionCode}/cities-municipalities`)

export const fetchCitiesByProvince = (provinceCode: string) =>
  get<PsgcItem[]>(`/provinces/${provinceCode}/cities-municipalities`)

export const fetchBarangays = (cityCode: string) =>
  get<PsgcItem[]>(`/cities-municipalities/${cityCode}/barangays`)

// Regions that have no provinces (cities are directly under region)
export const NO_PROVINCE_REGIONS = new Set([
  '130000000', // NCR
])

// Cost level mapping by region code prefix
export function getCostLevel(
  regionCode: string,
  cityName?: string,
): 'high' | 'medium' | 'low' {
  const HIGH_CITIES = new Set([
    'Manila', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong',
    'Quezon City', 'San Juan', 'Pasay', 'Parañaque',
    'Cebu City', 'Davao City',
  ])
  const MEDIUM_CITIES = new Set([
    'Caloocan', 'Marikina', 'Las Piñas', 'Muntinlupa', 'Valenzuela',
    'Malabon', 'Navotas', 'Pateros', 'Bacoor', 'Dasmariñas',
    'General Trias', 'Imus', 'Tagaytay', 'Calamba', 'Santa Rosa',
    'Biñan', 'Cabuyao', 'San Pedro', 'Antipolo', 'Cainta',
    'Taytay', 'San Mateo', 'Zamboanga City', 'Iloilo City',
    'Bacolod', 'Cagayan de Oro', 'Tagum', 'Lapu-Lapu', 'Mandaue',
    'Talisay', 'Baguio City', 'Angeles City', 'San Fernando',
  ])

  if (cityName) {
    if (HIGH_CITIES.has(cityName)) return 'high'
    if (MEDIUM_CITIES.has(cityName)) return 'medium'
  }

  // NCR
  if (regionCode.startsWith('13')) return 'high'
  // CALABARZON
  if (regionCode.startsWith('04')) return 'medium'
  // Central Luzon
  if (regionCode.startsWith('03')) return 'medium'
  // Central Visayas (Cebu)
  if (regionCode.startsWith('07')) return 'medium'
  // Davao
  if (regionCode.startsWith('11')) return 'medium'
  // Western Visayas
  if (regionCode.startsWith('06')) return 'medium'

  return 'low'
}
