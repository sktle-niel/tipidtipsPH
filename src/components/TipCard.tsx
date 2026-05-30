import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Tip } from '../types'
import CategoryBadge from './CategoryBadge'
import { formatTimeAgo } from '../data/mockData'

interface Props {
  tip: Tip
  variant?: 'default' | 'featured' | 'compact'
}

export default function TipCard({ tip, variant = 'default' }: Props) {
  if (variant === 'featured') {
    return (
      <Link
        to={`/tips/${tip.id}`}
        className="tip-card block bg-white rounded-2xl p-6 border border-[#e8ddd0] group"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <CategoryBadge category={tip.category} />
          <span className="text-xs text-[#a89880] whitespace-nowrap mt-0.5">
            {formatTimeAgo(tip.publishedAt)}
          </span>
        </div>
        <h3 className="font-bold text-[#1a1a1a] text-xl leading-snug mb-3 group-hover:text-[#2d6a4f] transition-colors">
          {tip.title}
        </h3>
        <p className="text-[#6b5e52] text-sm leading-relaxed line-clamp-3 mb-4">
          {tip.body}
        </p>
        <div className="flex items-center gap-1.5 text-[#2d6a4f] text-sm font-medium">
          Basahin <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/tips/${tip.id}`}
        className="tip-card flex items-start gap-3 py-3 border-b border-[#e8ddd0] last:border-0 group"
      >
        <span className="text-xl mt-0.5 shrink-0">
          {tip.category === 'weather' ? '🌧️'
            : tip.category === 'fuel' ? '⛽'
            : tip.category === 'food' ? '🥘'
            : tip.category === 'transport' ? '🚌'
            : tip.category === 'electricity' ? '💡'
            : tip.category === 'payday' ? '💰'
            : tip.category === 'emergency' ? '🆘'
            : '💡'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1a1a1a] leading-snug group-hover:text-[#2d6a4f] transition-colors line-clamp-2">
            {tip.title}
          </p>
          <p className="text-xs text-[#a89880] mt-0.5">{formatTimeAgo(tip.publishedAt)}</p>
        </div>
        <ArrowRight size={14} className="text-[#d9c4a0] group-hover:text-[#2d6a4f] transition-colors shrink-0 mt-1" />
      </Link>
    )
  }

  return (
    <Link
      to={`/tips/${tip.id}`}
      className="tip-card block bg-white rounded-xl p-5 border border-[#e8ddd0] group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <CategoryBadge category={tip.category} size="sm" />
        <span className="text-xs text-[#a89880] whitespace-nowrap mt-0.5">
          {formatTimeAgo(tip.publishedAt)}
        </span>
      </div>
      <h3 className="font-bold text-[#1a1a1a] text-base leading-snug mb-2 group-hover:text-[#2d6a4f] transition-colors">
        {tip.title}
      </h3>
      <p className="text-[#6b5e52] text-sm leading-relaxed line-clamp-2">
        {tip.body}
      </p>
    </Link>
  )
}
