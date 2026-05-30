import { Brain, Info } from 'lucide-react'
import { MOCK_PREDICTIONS, formatDate } from '../data/mockData'
import PredictionCard from '../components/PredictionCard'

export default function PredictionsPage() {
  return (
    <main className="min-h-screen bg-[#faf6f0]">
      <div
        className="py-14 md:py-20"
        style={{ background: 'linear-gradient(135deg, #2d6a4f 0%, #1e5c42 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 mb-6">
            <Brain size={13} className="text-[#f5a623]" />
            <span className="text-white/80 text-xs font-semibold tracking-wide">AI-assisted predictions</span>
          </div>
          <h1
            className="font-extrabold text-white leading-tight tracking-tight mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}
          >
            Hula ng Presyo at Kalagayan
          </h1>
          <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed">
            Batay sa weather data, fuel news, at market trends — para makapaghanda ka nang maaga at makatipid.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info size={15} className="text-[#b45309] shrink-0 mt-0.5" />
          <p className="text-[#6b5e52] text-sm leading-relaxed">
            <strong className="text-[#1a1a1a]">Disclaimer:</strong> Ang mga prediction na ito ay batay sa historical data at trends. Hindi ito financial advice. Palaging mag-verify sa opisyal na sources tulad ng DOE, PAGASA, at Meralco.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {MOCK_PREDICTIONS.map(prediction => (
            <div key={prediction.id} className="bg-white rounded-2xl p-6 border border-[#e8ddd0]">
              <PredictionCard prediction={prediction} variant="default" />
              <div className="mt-4 pt-4 border-t border-[#e8ddd0]">
                <p className="text-xs text-[#a89880]">
                  Valid hanggang: <strong className="text-[#6b5e52]">{formatDate(prediction.validUntil)}</strong>
                  <span className="mx-2">·</span>
                  Na-generate: {formatDate(prediction.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-base mb-2">Paano namin ginagawa ang mga hula?</p>
          <p className="text-[#a89880] text-sm leading-relaxed max-w-md mx-auto">
            Araw-araw, nag-a-analyze kami ng weather forecasts, fuel price news, at market trends para sa Pilipinas. Kapag may pattern na nakita kami, gumagawa kami ng prediction para maabisuhan kayo nang maaga.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Weather API', sub: 'Open-Meteo' },
              { label: 'News API', sub: 'Fuel & Economy' },
              { label: 'Rule Engine', sub: 'Pattern Detection' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-white text-sm font-semibold">{item.label}</p>
                <p className="text-[#6b5e52] text-xs mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
