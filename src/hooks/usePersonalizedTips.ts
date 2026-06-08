import { useMemo } from 'react'
import { useUserProfile } from '../context/UserProfileContext'
import { MOCK_TIPS } from '../data/mockData'
import {
  ALL_CACHED_TIPS,
  getLocationTips,
  sortByCostLevel,
  filterByCostLevel,
} from '../lib/personalization'
import type { CostLevel, Tip } from '../types'

// Re-exported for backwards compatibility (TipDetailPage imports these from here).
export { ALL_CACHED_TIPS }

// Find a tip by id — AI-cached location tips first, then the curated mock tips.
export function findTipById(id: string): Tip | undefined {
  return ALL_CACHED_TIPS.find(t => t.id === id) ?? MOCK_TIPS.find(t => t.id === id)
}

export function usePersonalizedTips() {
  const { profile } = useUserProfile()

  const costLevel: CostLevel | null = (profile?.costLevel as CostLevel) ?? null
  // hasLocation is true as long as a regionId is saved — even if setup isn't "completed"
  const hasLocation            = !!(profile?.regionId)
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
    return sortByCostLevel(pool, costLevel)
  }, [aiTips, hasCachedTips, costLevel, hasLocation])

  const filteredTips = useMemo(() => {
    const pool = hasCachedTips ? aiTips : MOCK_TIPS
    if (!hasLocation || !costLevel) return pool
    return filterByCostLevel(pool, costLevel)
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
