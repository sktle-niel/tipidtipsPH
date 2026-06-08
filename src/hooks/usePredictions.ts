import { useMemo } from 'react'
import { useUserProfile } from '../context/UserProfileContext'
import { getLocationPredictions } from '../lib/predictions'

// Re-exported for backwards compatibility.
export { getLocationPredictions }

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
