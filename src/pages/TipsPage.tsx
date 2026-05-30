import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { MOCK_TIPS, CATEGORIES } from '../data/mockData'
import type { TipCategory } from '../types'
import TipCard from '../components/TipCard'
import CategoryBadge from '../components/CategoryBadge'

export default function TipsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const activeCategory = searchParams.get('category') as TipCategory | null

  const filtered = useMemo(() => {
    let result = MOCK_TIPS
    if (activeCategory) result = result.filter(t => t.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, search])

  function setCategory(id: TipCategory | null) {
    if (id) setSearchParams({ category: id })
    else setSearchParams({})
  }

  return (
    <main className="min-h-screen bg-[#faf6f0]">
      <div className="bg-white border-b border-[#e8ddd0] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-2">
            Mga Tipid Tips
          </p>
          <h1 className="font-extrabold text-[#1a1a1a] tracking-tight mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Lahat ng Tipid Tips
          </h1>
          <p className="text-[#6b5e52] text-base">
            {MOCK_TIPS.length} tips — para sa mga Pilipinong gusto mag-ipon.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89880]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Maghanap ng tip..."
              className="w-full bg-white border border-[#e8ddd0] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#a89880] focus:outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-[#a89880]" />
            <span className="text-[#a89880] text-xs">Filter:</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !activeCategory
                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                : 'bg-white text-[#6b5e52] border-[#e8ddd0] hover:border-[#d9c4a0]'
            }`}
          >
            Lahat
          </button>
          {CATEGORIES.filter(c => c.id !== 'general').map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as TipCategory)}
              className={`transition-all ${activeCategory === cat.id ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
            >
              <CategoryBadge category={cat.id as TipCategory} size="sm" />
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-[#1a1a1a] mb-1">Walang nahanap</p>
            <p className="text-[#6b5e52] text-sm">Subukan ng ibang keyword o kategorya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(tip => (
              <TipCard key={tip.id} tip={tip} variant="default" />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
