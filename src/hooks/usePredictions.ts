import { useMemo } from 'react'
import { useUserProfile } from '../context/UserProfileContext'
import { MOCK_PREDICTIONS } from '../data/mockData'
import rawPredCache from '../data/locationPredictionsCache.json'
import type { Prediction } from '../types'

interface PredCacheEntry { generatedAt: string; predictions: Prediction[] }
const predCache = rawPredCache as { generatedDate: string; regions: Record<string, PredCacheEntry> }

// AI-generated predictions for a region (by 2-digit prefix), with graceful
// fallbacks: region '00' (general), then the curated mock predictions.
export function getLocationPredictions(regionId: string | null | undefined): Prediction[] {
  if (!regionId) return MOCK_PREDICTIONS
  const prefix = regionId.substring(0, 2)
  const entry  = predCache.regions[prefix] ?? predCache.regions['00']
  const preds  = entry?.predictions ?? []
  return preds.length > 0 ? (preds as Prediction[]) : MOCK_PREDICTIONS
}

export function usePredictions() {
  const { profile } = useUserProfile()

  const predictions = useMemo(
    () => getLocationPredictions(profile?.regionId),
    [profile?.regionId],
  )

  return {
    predictions,
    hasLocation:   !!profile?.regionId,
    locationLabel: profile?.cityName || profile?.regionName || null,
  }
}
