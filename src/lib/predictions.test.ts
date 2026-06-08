import { describe, it, expect } from 'vitest'
import { getLocationPredictions } from './predictions'
import { MOCK_PREDICTIONS } from '../data/mockData'

describe('getLocationPredictions', () => {
  it('falls back to the curated mock predictions when no region is given', () => {
    expect(getLocationPredictions(null)).toBe(MOCK_PREDICTIONS)
    expect(getLocationPredictions(undefined)).toBe(MOCK_PREDICTIONS)
  })

  it('always returns a non-empty list, even for an unknown region', () => {
    const preds = getLocationPredictions('99-unknown')
    expect(preds.length).toBeGreaterThan(0)
  })

  it('returns predictions for a known region prefix', () => {
    const preds = getLocationPredictions('13-ncr')
    expect(Array.isArray(preds)).toBe(true)
    expect(preds.length).toBeGreaterThan(0)
  })
})
