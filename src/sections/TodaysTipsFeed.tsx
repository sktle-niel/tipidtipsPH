import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { MOCK_TIPS } from '../data/mockData'
import TipCard from '../components/TipCard'

export default function TodaysTipsFeed() {
  const featured = MOCK_TIPS.find(t => t.isFeatured) ?? MOCK_TIPS[0]
  const secondary = MOCK_TIPS.filter(t => !t.isFeatured || t.id !== featured.id).slice(0, 5)

  return (
    <section className="py-16 md:py-20 bg-[#faf6f0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-2">
              Mga Tip Ngayon
            </p>
            <h2 className="font-extrabold text-[#1a1a1a] leading-tight tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}>
              I-save ang pera mo,
              <br />
              <span className="text-[#2d6a4f]">simula ngayon.</span>
            </h2>
          </div>
          <Link
            to="/tips"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#2d6a4f] text-sm font-semibold hover:gap-2.5 transition-all"
          >
            Tingnan lahat <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <TipCard tip={featured} variant="featured" />
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
            {secondary.slice(0, 4).map(tip => (
              <TipCard key={tip.id} tip={tip} variant="default" />
            ))}
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-[#e8ddd0] p-5">
          <p className="text-xs font-bold text-[#a89880] uppercase tracking-wider mb-3">
            Mga Latest Tips
          </p>
          <div className="divide-y divide-[#e8ddd0]">
            {MOCK_TIPS.slice(4).map(tip => (
              <TipCard key={tip.id} tip={tip} variant="compact" />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/tips"
            className="inline-flex items-center gap-2 border border-[#2d6a4f] text-[#2d6a4f] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#2d6a4f] hover:text-white transition-all"
          >
            Tingnan lahat ng tips <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
