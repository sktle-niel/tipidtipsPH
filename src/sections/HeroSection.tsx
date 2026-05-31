import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, CloudRain, TrendingUp, Zap, MapPin } from 'lucide-react'
import CategoryBadge from '../components/CategoryBadge'
import { usePersonalizedTips } from '../hooks/usePersonalizedTips'
import { MOCK_TIPS } from '../data/mockData'

export default function HeroSection() {
  const { featuredTip, hasLocation, locationLabel, personalizedTips } = usePersonalizedTips()
  const previewTips = (hasLocation ? personalizedTips : MOCK_TIPS).slice(1, 3)

  return (
    <section className="relative overflow-hidden bg-[#faf6f0] pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f5a623 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2d6a4f 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#f5a623]/10 border border-[#f5a623]/30 rounded-full px-3.5 py-1.5 mb-6 animate-float-up">
              {hasLocation && locationLabel ? (
                <>
                  <MapPin size={13} className="text-[#f5a623]" />
                  <span className="text-[#b45309] text-xs font-semibold tracking-wide">
                    Tips para sa {locationLabel}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-[#f5a623]" />
                  <span className="text-[#b45309] text-xs font-semibold tracking-wide">
                    Tips na fresh — updated daily
                  </span>
                </>
              )}
            </div>

            <h1
              className="font-extrabold text-[#1a1a1a] leading-[1.05] tracking-tight mb-5 animate-float-up delay-100"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)' }}
            >
              Mag-ipon tayo,
              <br />
              <span className="text-[#2d6a4f]">isa-isang</span>{' '}
              <span
                className="relative"
                style={{
                  background: 'linear-gradient(135deg, #f5a623 0%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                tip.
              </span>
            </h1>

            <p className="text-[#6b5e52] text-lg leading-relaxed mb-8 animate-float-up delay-200 max-w-md">
              Araw-araw na money-saving tips para sa mga Pilipino — batay sa weather, presyo ng gasolina, at trending news sa Pilipinas.
            </p>

            <div className="flex flex-wrap items-center gap-3 animate-float-up delay-300">
              <Link
                to="/tips"
                className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d97706] text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Tingnan ang Tips Ngayon
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/predictions"
                className="inline-flex items-center gap-2 border border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
              >
                Hula ng Presyo
                <TrendingUp size={14} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8 animate-float-up delay-400">
              {[
                { icon: CloudRain, label: 'Weather data' },
                { icon: TrendingUp, label: 'Live fuel prices' },
                { icon: Zap, label: 'Meralco trends' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[#8b7355] text-xs">
                  <Icon size={12} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-sm animate-float-up delay-200">
            <div className="relative">
              <div className="absolute -top-3 -right-3 bg-[#f5a623] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                Tip ngayon ☀️
              </div>

              <Link
                to={`/tips/${featuredTip.id}`}
                className="tip-card block bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(26,26,26,0.08)] border border-[#e8ddd0]"
              >
                <div className="mb-4">
                  <CategoryBadge category={featuredTip.category} />
                </div>
                <h3 className="font-bold text-[#1a1a1a] text-lg leading-snug mb-3">
                  {featuredTip.title}
                </h3>
                <p className="text-[#6b5e52] text-sm leading-relaxed line-clamp-4 mb-4">
                  {featuredTip.body}
                </p>
                <div className="flex items-center gap-1.5 text-[#2d6a4f] text-sm font-semibold">
                  Basahin ang buong tip <ArrowRight size={14} />
                </div>
              </Link>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {previewTips.map(tip => (
                  <Link
                    key={tip.id}
                    to={`/tips/${tip.id}`}
                    className="tip-card bg-white rounded-xl p-3.5 border border-[#e8ddd0] shadow-sm"
                  >
                    <CategoryBadge category={tip.category} size="sm" />
                    <p className="text-[#1a1a1a] text-xs font-semibold mt-2 leading-snug line-clamp-2">
                      {tip.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
