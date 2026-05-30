import { TrendingUp, Flame } from 'lucide-react'
import { MOCK_TRENDING } from '../data/mockData'

export default function TrendingTopics() {
  const doubled = [...MOCK_TRENDING, ...MOCK_TRENDING]

  return (
    <section className="py-12 bg-[#1a1a1a] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#f5a623]/20 rounded-full flex items-center justify-center">
            <Flame size={13} className="text-[#f5a623]" />
          </div>
          <p className="text-[#d9c4a0] text-sm font-semibold">
            Trending Sa Pilipinas Ngayon
          </p>
          <span className="text-[#6b5e52] text-xs">· na-update kanina lang</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #1a1a1a, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #1a1a1a, transparent)' }} />

        <div className="overflow-hidden">
          <div className="animate-marquee flex items-center gap-3 py-1">
            {doubled.map((topic, i) => (
              <div
                key={`${topic.id}-${i}`}
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 shrink-0 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <TrendingUp size={12} className="text-[#f5a623]" />
                <span className="text-[#d9c4a0] text-sm font-medium whitespace-nowrap">
                  {topic.keyword}
                </span>
                <span className="text-[#6b5e52] text-xs font-mono">
                  {topic.trendScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOCK_TRENDING.slice(0, 4).map((topic, i) => (
            <div
              key={topic.id}
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <span className="text-[#6b5e52] text-xs font-mono w-4 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[#d9c4a0] text-sm leading-snug flex-1 min-w-0 truncate group-hover:text-white transition-colors">
                {topic.keyword}
              </span>
              <TrendingUp size={11} className="text-[#f5a623] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
