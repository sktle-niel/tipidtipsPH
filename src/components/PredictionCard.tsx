import { TrendingUp, Zap, Cloud, ShoppingCart, Bus } from 'lucide-react'
import type { Prediction } from '../types'

interface Props {
  prediction: Prediction
  variant?: 'default' | 'banner'
}

const TYPE_CONFIG = {
  fuel: { icon: TrendingUp, label: 'Fuel', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  electricity: { icon: Zap, label: 'Kuryente', color: '#d97706', bg: '#fefce8', border: '#fef08a' },
  weather: { icon: Cloud, label: 'Panahon', color: '#1d6fa4', bg: '#eff6ff', border: '#bfdbfe' },
  food: { icon: ShoppingCart, label: 'Pagkain', color: '#2d6a4f', bg: '#f0fdf4', border: '#bbf7d0' },
  transport: { icon: Bus, label: 'Transport', color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
}

const CONFIDENCE_LABEL = {
  low: 'Possible',
  medium: 'Malamang',
  high: 'Halos sigurado',
}

const CONFIDENCE_DOTS = {
  low: 1,
  medium: 2,
  high: 3,
}

export default function PredictionCard({ prediction, variant = 'default' }: Props) {
  const config = TYPE_CONFIG[prediction.type]
  const Icon = config.icon
  const dots = CONFIDENCE_DOTS[prediction.confidenceLevel]

  if (variant === 'banner') {
    return (
      <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Icon size={15} className="text-white" />
          </div>
          <span className="text-white/80 text-xs font-medium uppercase tracking-wider">{config.label}</span>
        </div>
        <p className="text-white font-bold text-sm leading-snug">{prediction.summary}</p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(i => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i <= dots ? 'bg-white w-4' : 'bg-white/30 w-2'}`}
            />
          ))}
          <span className="text-white/70 text-xs ml-1">{CONFIDENCE_LABEL[prediction.confidenceLevel]}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: config.bg, borderColor: config.border }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: config.border }}
        >
          <Icon size={15} style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-semibold" style={{ color: config.color }}>{config.label}</span>
            <span className="text-[#a89880] text-xs">·</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(i => (
                <span
                  key={i}
                  className="h-1 rounded-full"
                  style={{
                    width: i <= dots ? 12 : 6,
                    backgroundColor: i <= dots ? config.color : '#d9c4a0',
                  }}
                />
              ))}
              <span className="text-[#a89880] text-xs ml-0.5">{CONFIDENCE_LABEL[prediction.confidenceLevel]}</span>
            </div>
          </div>
          <p className="font-semibold text-[#1a1a1a] text-sm leading-snug mb-1">{prediction.summary}</p>
          <p className="text-[#6b5e52] text-xs leading-relaxed">{prediction.detail}</p>
        </div>
      </div>
    </div>
  )
}
