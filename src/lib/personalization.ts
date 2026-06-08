/**
 * Pure tip-personalization logic — no React, no Firebase, so it can be
 * unit-tested directly. The hooks import from here.
 */
import rawLocationCache from '../data/locationTipsCache.json'
import type { CostLevel, Tip } from '../types'

interface CacheEntry { generatedAt: string; tips: Tip[] }
const locationCache = rawLocationCache as { generatedDate: string; regions: Record<string, CacheEntry> }

// All tips across every cached region — used by the tip detail page lookup.
export const ALL_CACHED_TIPS: Tip[] = Object.values(locationCache.regions).flatMap(r => r.tips as Tip[])

/** Stable per-day seed (YYYYMMDD) so the daily rotation is deterministic. */
export function dailySeed(date: Date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
}

/** Rotate an array by a daily offset so the "top" tip changes each day. */
export function rotateTips<T>(tips: T[], seed: number = dailySeed()): T[] {
  if (tips.length === 0) return tips
  const offset = ((seed % tips.length) + tips.length) % tips.length
  return [...tips.slice(offset), ...tips.slice(0, offset)]
}

/** AI-cached tips for a region (2-digit prefix), falling back to '00' (general). */
export function getLocationTips(regionId: string | null | undefined): Tip[] {
  if (!regionId) return []
  const prefix = regionId.substring(0, 2)
  const entry  = locationCache.regions[prefix] ?? locationCache.regions['00']
  const tips   = (entry?.tips ?? []) as Tip[]
  return rotateTips(tips)
}

/** Stable sort that floats tips matching the user's cost level to the top. */
export function sortByCostLevel(tips: Tip[], costLevel: CostLevel): Tip[] {
  return [...tips].sort((a, b) => {
    const aMatch = a.targetCostLevels.includes(costLevel)
    const bMatch = b.targetCostLevels.includes(costLevel)
    if (aMatch && !bMatch) return -1
    if (!aMatch && bMatch) return 1
    return 0
  })
}

/** Keep only tips that are universal (all 3 levels) or match the cost level. */
export function filterByCostLevel(tips: Tip[], costLevel: CostLevel): Tip[] {
  return tips.filter(t => {
    const isUniversal = t.targetCostLevels.length === 3
    return isUniversal || t.targetCostLevels.includes(costLevel)
  })
}
