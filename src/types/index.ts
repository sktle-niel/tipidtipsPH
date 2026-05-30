export type TipCategory =
  | 'weather'
  | 'fuel'
  | 'food'
  | 'transport'
  | 'electricity'
  | 'payday'
  | 'general'
  | 'emergency'

export interface Tip {
  id: string
  title: string
  body: string
  category: TipCategory
  tags: string[]
  sourceTrigger: string
  createdAt: string
  publishedAt: string
  isPublished: boolean
  isFeatured?: boolean
}

export interface Prediction {
  id: string
  type: 'fuel' | 'weather' | 'food' | 'electricity' | 'transport'
  summary: string
  detail: string
  confidenceLevel: 'low' | 'medium' | 'high'
  validUntil: string
  createdAt: string
}

export interface TrendingTopic {
  id: string
  keyword: string
  trendScore: number
  region: string
  fetchedAt: string
}

export interface CategoryInfo {
  id: TipCategory
  label: string
  labelTl: string
  emoji: string
  color: string
  bgColor: string
  borderColor: string
}
