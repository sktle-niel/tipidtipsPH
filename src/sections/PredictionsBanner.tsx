import { Link } from 'react-router-dom'
import { ArrowRight, Brain, MapPin } from 'lucide-react'
import { MOCK_PREDICTIONS } from '../data/mockData'
import PredictionCard from '../components/PredictionCard'
import { useUserProfile } from '../context/UserProfileContext'
import rawPredCache from '../data/locationPredictionsCache.json'
import type { Prediction } from '../types'

interface PredCacheEntry { generatedAt: string; predictions: Prediction[] }
const predCache = (rawPredCache as { generatedDate: string; regions: Record<string, PredCacheEntry> })

function getLocationPredictions(regionId: string | null | undefined): Prediction[] {
  if (!regionId) return MOCK_PREDICTIONS
  const prefix = regionId.substring(0, 2)
  const entry  = predCache.regions[prefix] ?? predCache.regions['00']
  return (entry?.predictions ?? []).length > 0
    ? (entry.predictions as Prediction[])
    : MOCK_PREDICTIONS
}

export default function PredictionsBanner() {
  const { profile } = useUserProfile()
  const locationLabel = profile?.cityName || profile?.regionName
  const predictions   = getLocationPredictions(profile?.regionId)

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, #2d6a4f 0%, #1e5c42 50%, #165534 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#f5a623' }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#f5a623' }} />

          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5">
                    <Brain size={13} className="text-[#f5a623]" />
                    <span className="text-white/80 text-xs font-semibold tracking-wide">AI-assisted predictions</span>
                  </div>
                  {locationLabel && (
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                      <MapPin size={11} className="text-[#f5a623]" />
                      <span className="text-white/70 text-xs font-medium">{locationLabel}</span>
                    </div>
                  )}
                </div>
                <h2 className="font-extrabold text-white leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  Handa Ka Na Ba?
                  <br />
                  <span className="text-[#f5a623]">
                    {locationLabel ? `Mga hula para sa ${locationLabel}.` : 'Tingnan ang mga hula.'}
                  </span>
                </h2>
                <p className="text-white/60 text-sm mt-2 max-w-sm leading-relaxed">
                  Batay sa weather data, fuel news, at market trends — para makapaghanda ka nang maaga.
                </p>
              </div>

              <Link
                to="/predictions"
                className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d97706] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shrink-0"
              >
                Lahat ng Hula <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {predictions.slice(0, 3).map(prediction => (
                <PredictionCard key={prediction.id} prediction={prediction} variant="banner" />
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse-soft" />
              <p className="text-white/50 text-xs">
                Predictions ay updated araw-araw batay sa pinakabagong data.
                Hindi ito financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
