import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, MOCK_TIPS } from '../data/mockData'
import type { TipCategory } from '../types'

export default function CategoriesSection() {
  const countByCategory = (id: TipCategory) =>
    MOCK_TIPS.filter(t => t.category === id).length

  const mainCategories = CATEGORIES.filter(c => c.id !== 'general')

  return (
    <section className="py-16 md:py-20 bg-[#f5ede0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-2">
              Mga Kategorya
            </p>
            <h2 className="font-extrabold text-[#1a1a1a] leading-tight tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}>
              Hanapin ang tip
              <br />
              <span className="text-[#2d6a4f]">na kailangan mo.</span>
            </h2>
          </div>
          <Link
            to="/tips"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#2d6a4f] text-sm font-semibold hover:gap-2.5 transition-all"
          >
            Lahat ng tips <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {mainCategories.slice(0, 3).map((cat, i) => (
            <Link
              key={cat.id}
              to={`/tips?category=${cat.id}`}
              className={`tip-card group rounded-2xl p-6 border flex flex-col gap-3 ${i === 0 ? 'sm:col-span-1 lg:row-span-1' : ''}`}
              style={{ background: cat.bgColor, borderColor: cat.borderColor }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base mb-0.5">{cat.label}</h3>
                <p className="text-[#6b5e52] text-xs">{cat.labelTl}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium" style={{ color: cat.color }}>
                  {countByCategory(cat.id as TipCategory)} tips
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" style={{ color: cat.color }} />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {mainCategories.slice(3).map(cat => (
            <Link
              key={cat.id}
              to={`/tips?category=${cat.id}`}
              className="tip-card group rounded-2xl p-5 border flex flex-col gap-2.5"
              style={{ background: cat.bgColor, borderColor: cat.borderColor }}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-sm mb-0.5">{cat.label}</h3>
                <p className="text-[#6b5e52] text-xs">{cat.labelTl}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium" style={{ color: cat.color }}>
                  {countByCategory(cat.id as TipCategory)} tips
                </span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" style={{ color: cat.color }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
