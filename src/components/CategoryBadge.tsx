import { getCategoryInfo } from '../data/mockData'
import type { TipCategory } from '../types'

interface Props {
  category: TipCategory
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const info = getCategoryInfo(category)

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{
        color: info.color,
        backgroundColor: info.bgColor,
        border: `1px solid ${info.borderColor}`,
      }}
    >
      <span className="text-sm leading-none">{info.emoji}</span>
      {info.label}
    </span>
  )
}
