import { useEffect } from 'react'
import { X, MapPin, Eye, CheckCircle, ChefHat, ShoppingBasket, Lightbulb } from 'lucide-react'
import type { FoodVlog } from '../types'
import { getPlatformConfig } from '../data/foodVlogs'

interface Props {
  vlog: FoodVlog
  onClose: () => void
}

export default function VideoModal({ vlog, onClose }: Props) {
  const platform   = getPlatformConfig(vlog.platform)
  const { content } = vlog

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#111111] rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white rounded-full p-1.5 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3d3530 transparent' }}>

          {/* Hero */}
          <div className="bg-[#0d0d0d] px-6 pt-8 pb-5 text-center border-b border-white/5">
            <div className="text-6xl mb-3">{vlog.thumbnailEmoji}</div>

            <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: platform.bg, color: platform.color }}
              >
                {platform.icon} {platform.label}
              </span>
              <span className="bg-[#f5a623]/20 text-[#f5a623] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {vlog.priceLabel}
              </span>
              {vlog.isVerified && (
                <span className="flex items-center gap-1 text-[#2d9e6b] text-[10px] font-semibold">
                  <CheckCircle size={10} /> Nasubok na
                </span>
              )}
            </div>

            <h2 className="font-extrabold text-white text-lg leading-snug mb-1">{vlog.foodName}</h2>
            <p className="text-[#a89880] text-xs mb-3">{vlog.restaurantName}</p>

            <div className="flex items-center justify-center gap-4 text-[#3d3530] text-xs">
              <div className="flex items-center gap-1">
                <MapPin size={9} /> {vlog.location}
              </div>
              {vlog.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye size={9} /> {vlog.viewCount} views
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">

            {/* Summary */}
            <p className="text-[#a89880] text-sm leading-relaxed">{content.summary}</p>

            {/* Ingredients (recipe only) */}
            {content.ingredients && content.ingredients.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#f5a623]/10 rounded-lg p-1.5">
                    <ShoppingBasket size={14} className="text-[#f5a623]" />
                  </div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                    Mga Sangkap
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {content.ingredients.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#a89880] text-xs leading-relaxed">
                      <span className="text-[#f5a623] mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps (recipe only) */}
            {content.steps && content.steps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#f5a623]/10 rounded-lg p-1.5">
                    <ChefHat size={14} className="text-[#f5a623]" />
                  </div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                    Paano Lutuin
                  </h3>
                </div>
                <ol className="space-y-3">
                  {content.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="bg-[#f5a623] text-black text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[#a89880] text-xs leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tips */}
            {content.tips && content.tips.length > 0 && (
              <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#2d9e6b]/10 rounded-lg p-1.5">
                    <Lightbulb size={14} className="text-[#2d9e6b]" />
                  </div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                    {content.type === 'recipe' ? 'Mga Tips' : 'Paano Puntahan / Mag-order'}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {content.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#a89880] text-xs leading-relaxed">
                      <span className="text-[#2d9e6b] mt-0.5 shrink-0">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Creator credit */}
            <div className="pt-1 border-t border-white/5">
              <p className="text-[#3d3530] text-[10px] uppercase tracking-wide mb-0.5">
                {content.type === 'recipe' ? 'Recipe creator' : 'Food finder'}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                  style={{ background: platform.bg, color: platform.color }}
                >
                  {platform.icon}
                </span>
                <p className="text-[#6b5e52] text-xs font-medium">{vlog.creatorName}</p>
                <p className="text-[#3d3530] text-xs">{vlog.creatorHandle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
