import { describe, it, expect } from 'vitest'
import { rotateTips, sortByCostLevel, filterByCostLevel } from './personalization'
import type { CostLevel, Tip } from '../types'

function tip(id: string, targetCostLevels: CostLevel[], extra: Partial<Tip> = {}): Tip {
  return {
    id,
    title: id,
    body: '',
    category: 'general',
    tags: [],
    sourceTrigger: 'test',
    createdAt: '',
    publishedAt: '',
    isPublished: true,
    targetCostLevels,
    ...extra,
  }
}

describe('rotateTips', () => {
  it('returns an empty array unchanged', () => {
    expect(rotateTips([], 5)).toEqual([])
  })

  it('rotates by seed % length', () => {
    expect(rotateTips([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5, 1, 2])
  })

  it('is a no-op when the offset wraps to 0', () => {
    expect(rotateTips([1, 2, 3, 4, 5], 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('wraps seeds larger than the length', () => {
    expect(rotateTips([1, 2, 3, 4, 5], 7)).toEqual([3, 4, 5, 1, 2])
  })
})

describe('sortByCostLevel', () => {
  it('floats matching tips to the top while preserving relative order', () => {
    const tips = [tip('a', ['low']), tip('b', ['high']), tip('c', ['high'])]
    expect(sortByCostLevel(tips, 'high').map(t => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('does not mutate the input array', () => {
    const tips = [tip('a', ['low']), tip('b', ['high'])]
    sortByCostLevel(tips, 'high')
    expect(tips.map(t => t.id)).toEqual(['a', 'b'])
  })
})

describe('filterByCostLevel', () => {
  it('keeps universal tips and cost-level matches, drops the rest', () => {
    const tips = [
      tip('universal', ['high', 'medium', 'low']),
      tip('match', ['high']),
      tip('miss', ['low']),
    ]
    expect(filterByCostLevel(tips, 'high').map(t => t.id)).toEqual(['universal', 'match'])
  })
})
