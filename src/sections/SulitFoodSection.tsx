import { useState } from 'react'
import { MapPin, Eye, CheckCircle, Calendar, BookOpen, ChevronRight } from 'lucide-react'
import { FOOD_VLOGS, getPlatformConfig } from '../data/foodVlogs'
import { useUserProfile } from '../context/UserProfileContext'
import VideoModal from '../components/VideoModal'
import type { FoodVlog, CostLevel } from '../types'

function getDayOffset(postedAt: string): number {
  const msAgo = Date.now() - new Date(postedAt).getTime()
  return Math.floor(msAgo / (24 * 60 * 60 * 1000))
}

function getDateLabel(dayOffset: number): string {
  const d = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000)
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

const DAY_TABS = [
  { offset: 0, label: 'Ngayon' },
  { offset: 1, label: 'Kahapon' },
  { offset: 2, label: '2 Araw' },
  { offset: 3, label: '3 Araw' },
] as const

export default function SulitFoodSection() {
  const { profile } = useUserProfile()
  const [selectedDay, setSelectedDay] = useState(0)
  const [activeVlog, setActiveVlog] = useState<FoodVlog | null>(null)

  const costLevel    = (profile?.costLevel ?? null) as CostLevel | null
  const regionCode   = profile?.regionId ?? null
  const hasLocation  = !!profile?.setupCompleted
  const locationLabel = profile?.cityName || profile?.regionName

  const vlogs = getPersonalizedVlogs(regionCode, costLevel, hasLocation, selectedDay)

  const hasAnyToday = FOOD_VLOGS.some(v => getDayOffset(v.postedAt) === 0)
  if (!hasAnyToday) return null

  return (
    <>
      {activeVlog && (
        <VideoModal vlog={activeVlog} onClose={() => setActiveVlog(null)} />
      )}

      <section className="py-16 md:py-20 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="mb-6">
            {hasLocation && locationLabel ? (
              <>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={12} className="text-[#f5a623]" />
                  <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">
                    Sulit Food Finds sa {locationLabel}
                  </p>
                </div>
                <h2
                  className="font-extrabold text-white leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                >
                  Trending na kinakain
                  <br />
                  <span className="text-[#f5a623]">sa lugar mo.</span>
                </h2>
              </>
            ) : (
              <>
                <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-2">
                  Sulit Food Finds
                </p>
                <h2
                  className="font-extrabold text-white leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                >
                  Trending na pagkain
                  <br />
                  <span className="text-[#f5a623]">na sulit at masarap.</span>
                </h2>
              </>
            )}
            <p className="text-[#6b5e52] text-sm mt-2 max-w-md">
              Natuklasan ng mga local content creators — i-click para panoorin dito mismo.
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {DAY_TABS.map(tab => {
              const isActive = selectedDay === tab.offset
              const sublabel = tab.offset === 0 ? '🔥 Bagong luto' : getDateLabel(tab.offset)
              return (
                <button
                  key={tab.offset}
                  onClick={() => setSelectedDay(tab.offset)}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#f5a623] border-[#f5a623] text-black'
                      : 'bg-white/5 border-white/10 text-[#a89880] hover:border-[#f5a623]/50 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {tab.label}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'text-black/60' : 'text-[#3d3530]'}`}>
                    {sublabel}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          {vlogs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={28} className="mx-auto mb-3 text-[#3d3530]" />
              <p className="text-[#3d3530] text-sm">
                Walang food finds para sa araw na ito
                {hasLocation && locationLabel ? ` sa ${locationLabel}` : ''}.
              </p>
              {selectedDay > 0 && (
                <button
                  onClick={() => setSelectedDay(0)}
                  className="mt-3 text-[#f5a623] text-xs hover:underline"
                >
                  Tingnan ang ngayon →
                </button>
              )}
            </div>
          ) : (
            <>
              <FoodVlogFeatured
                vlog={vlogs[0]}
                isToday={selectedDay === 0}
                onPlay={() => setActiveVlog(vlogs[0])}
              />
              {vlogs.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {vlogs.slice(1, 7).map(vlog => (
                    <FoodVlogCard
                      key={vlog.id}
                      vlog={vlog}
                      isToday={selectedDay === 0}
                      onPlay={() => setActiveVlog(vlog)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!hasLocation && (
            <div className="mt-6 text-center">
              <p className="text-[#6b5e52] text-xs">
                I-set ang iyong lokasyon para makita ang mga food finds sa inyong lugar.{' '}
                <a href="/setup-location" className="text-[#f5a623] hover:underline font-medium">
                  I-setup →
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// ── Card components ────────────────────────────────────────────────────────

function FoodVlogFeatured({
  vlog,
  isToday,
  onPlay,
}: {
  vlog: FoodVlog
  isToday: boolean
  onPlay: () => void
}) {
  const platform = getPlatformConfig(vlog.platform)

  return (
    <button
      onClick={onPlay}
      className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 hover:bg-white/10 transition-all group"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="relative w-full sm:w-32 h-28 shrink-0">
          <div
            className="w-full h-full rounded-xl flex items-center justify-center text-5xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {vlog.thumbnailEmoji}
          </div>
          {isToday && (
            <span className="absolute -top-2 -right-2 bg-[#f5a623] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full leading-tight tracking-wide">
              BAGO!
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: platform.bg, color: platform.color }}
            >
              {platform.icon} {platform.label}
            </span>
            <span className="bg-[#f5a623]/20 text-[#f5a623] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {vlog.priceLabel}
            </span>
            {vlog.content.type === 'recipe' && (
              <span className="flex items-center gap-1 text-[#a78bfa] text-[10px] font-semibold">
                <BookOpen size={10} /> May Recipe
              </span>
            )}
            {vlog.isVerified && (
              <span className="flex items-center gap-1 text-[#2d9e6b] text-[10px] font-semibold">
                <CheckCircle size={10} /> Nasubok na
              </span>
            )}
          </div>

          <h3 className="font-bold text-white text-base leading-snug mb-1 group-hover:text-[#f5a623] transition-colors">
            {vlog.foodName}
          </h3>
          <p className="text-[#a89880] text-xs mb-2">{vlog.restaurantName}</p>
          <p className="text-[#6b5e52] text-sm leading-relaxed mb-3 line-clamp-2">
            {vlog.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#6b5e52] text-xs">
              <MapPin size={10} /> {vlog.location}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#3d3530] text-xs">{vlog.creatorHandle}</span>
              {vlog.viewCount && (
                <div className="flex items-center gap-1 text-[#6b5e52] text-xs">
                  <Eye size={10} /> {vlog.viewCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

function FoodVlogCard({
  vlog,
  isToday,
  onPlay,
}: {
  vlog: FoodVlog
  isToday: boolean
  onPlay: () => void
}) {
  const platform = getPlatformConfig(vlog.platform)

  return (
    <button
      onClick={onPlay}
      className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            {vlog.thumbnailEmoji}
          </div>
          {isToday && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#f5a623] text-black text-[8px] font-extrabold px-1.5 py-px rounded-full leading-tight">
              BAGO
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
              style={{ background: platform.bg, color: platform.color }}
            >
              {platform.icon}
            </span>
            <span className="bg-[#f5a623]/20 text-[#f5a623] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {vlog.priceLabel}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm leading-snug group-hover:text-[#f5a623] transition-colors line-clamp-2">
            {vlog.foodName}
          </h3>
          <p className="text-[#6b5e52] text-xs mt-0.5 truncate">{vlog.restaurantName}</p>
        </div>
        <ChevronRight size={14} className="text-[#3d3530] group-hover:text-[#f5a623] transition-colors shrink-0" />
      </div>

      <p className="text-[#6b5e52] text-xs leading-relaxed line-clamp-2 mb-3">
        {vlog.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[#3d3530] text-xs">
          <MapPin size={9} />
          <span className="truncate max-w-[100px]">{vlog.location}</span>
        </div>
        {vlog.viewCount && (
          <div className="flex items-center gap-1 text-[#3d3530] text-xs">
            <Eye size={9} /> {vlog.viewCount}
          </div>
        )}
      </div>
    </button>
  )
}

// ── Data helpers ───────────────────────────────────────────────────────────

function getPersonalizedVlogs(
  regionCode: string | null,
  costLevel: CostLevel | null,
  hasLocation: boolean,
  dayOffset: number,
): FoodVlog[] {
  const dayVlogs = FOOD_VLOGS.filter(v => getDayOffset(v.postedAt) === dayOffset)

  if (!hasLocation || !regionCode) {
    const national = dayVlogs.filter(v => v.regionIds.length === 0)
    return national.length > 0 ? national.slice(0, 6) : dayVlogs.slice(0, 6)
  }

  const regionPrefix = regionCode.substring(0, 2)

  const matched = dayVlogs.filter(v => {
    const regionMatch =
      v.regionIds.length === 0 ||
      v.regionIds.some(r => r.startsWith(regionPrefix))
    const costMatch = !costLevel || v.costLevels.includes(costLevel)
    return regionMatch && costMatch
  })

  if (matched.length === 0) return dayVlogs.filter(v => v.regionIds.length === 0)

  return matched.sort((a, b) => {
    const aLocal = a.regionIds.some(r => r.startsWith(regionPrefix))
    const bLocal = b.regionIds.some(r => r.startsWith(regionPrefix))
    return aLocal === bLocal ? 0 : aLocal ? -1 : 1
  })
}
