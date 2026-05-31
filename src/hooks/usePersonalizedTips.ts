import { useMemo } from 'react'
import { useUserProfile } from '../context/UserProfileContext'
import { MOCK_TIPS } from '../data/mockData'
import rawLocationCache from '../data/locationTipsCache.json'
import type { CostLevel, Tip } from '../types'

interface CacheEntry { generatedAt: string; tips: Tip[] }
const locationCache = (rawLocationCache as { generatedDate: string; regions: Record<string, CacheEntry> })

function getLocationTips(regionId: string | null | undefined): Tip[] {
  if (!regionId) return []
  const prefix = regionId.substring(0, 2)
  const entry  = locationCache.regions[prefix] ?? locationCache.regions['00']
  return entry?.tips ?? []
}

export function usePersonalizedTips() {
  const { profile } = useUserProfile()

  const costLevel: CostLevel  = (profile?.costLevel as CostLevel) ?? null
  const hasLocation            = !!profile?.setupCompleted
  const locationLabel          = profile?.cityName || profile?.regionName || null

  // AI-generated tips for this region — takes priority over mock data
  const aiTips = useMemo(
    () => getLocationTips(profile?.regionId),
    [profile?.regionId],
  )

  const hasCachedTips = aiTips.length > 0

  const personalizedTips = useMemo(() => {
    const pool = hasCachedTips ? aiTips : MOCK_TIPS

    if (!hasLocation || !costLevel) return pool

    return [...pool].sort((a, b) => {
      const aMatch = a.targetCostLevels.includes(costLevel)
      const bMatch = b.targetCostLevels.includes(costLevel)
      if (aMatch && !bMatch) return -1
      if (!aMatch && bMatch) return 1
      return 0
    })
  }, [aiTips, hasCachedTips, costLevel, hasLocation])

  const filteredTips = useMemo(() => {
    const pool = hasCachedTips ? aiTips : MOCK_TIPS

    if (!hasLocation || !costLevel) return pool

    return pool.filter(t => {
      const isUniversal = t.targetCostLevels.length === 3
      const matchesCost = t.targetCostLevels.includes(costLevel)
      return isUniversal || matchesCost
    })
  }, [aiTips, hasCachedTips, costLevel, hasLocation])

  const featuredTip = useMemo(() => {
    const pool = hasLocation ? personalizedTips : (hasCachedTips ? aiTips : MOCK_TIPS)
    return pool.find(t => t.isFeatured) ?? pool[0]
  }, [personalizedTips, aiTips, hasCachedTips, hasLocation])

  return {
    allTips: hasCachedTips ? aiTips : MOCK_TIPS,
    personalizedTips,
    filteredTips,
    featuredTip,
    hasLocation,
    hasCachedTips,
    costLevel,
    locationLabel,
  }
}
