export type TipCategory =
  | 'weather'
  | 'fuel'
  | 'food'
  | 'transport'
  | 'electricity'
  | 'payday'
  | 'general'
  | 'emergency'

export type CostLevel = 'high' | 'medium' | 'low'

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
  targetCostLevels: CostLevel[]  // which cost levels this tip is relevant for
  locationNote?: string           // optional note like "Para sa Metro Manila"
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

export type Platform = 'tiktok' | 'youtube' | 'facebook' | 'instagram'

export interface VlogContent {
  type: 'recipe' | 'food-spot'
  summary: string
  ingredients?: string[]
  steps?: string[]
  tips?: string[]
}

export interface FoodVlog {
  id: string
  creatorName: string
  creatorHandle: string
  platform: Platform
  foodName: string
  restaurantName: string
  price: number
  priceLabel: string
  location: string
  regionIds: string[]
  costLevels: CostLevel[]
  description: string
  tags: string[]
  thumbnailEmoji: string
  isVerified: boolean
  viewCount?: string
  postedAt: string
  content: VlogContent
  videoUrl?: string  // direct link to the source post — filled by enrichVlogLinks.ts
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
