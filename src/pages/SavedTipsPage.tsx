import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { MOCK_TIPS } from '../data/mockData'
import { useSavedTips } from '../hooks/useSavedTips'
import TipCard from '../components/TipCard'
import { useAuth } from '../context/AuthContext'

export default function SavedTipsPage() {
  const { user } = useAuth()
  const { savedIds, clearAll } = useSavedTips()
  const savedTips = MOCK_TIPS.filter(t => savedIds.includes(t.id))

  if (!user) {
    return (
      <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🔐</p>
          <h1 className="font-bold text-[#1a1a1a] text-xl mb-2">Kailangan mag-login</h1>
          <p className="text-[#6b5e52] text-sm mb-5">Mag-login muna para makita ang iyong mga na-save na tips.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#f5a623] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#d97706] transition-colors"
          >
            Mag-login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf6f0]">
      <div className="bg-white border-b border-[#e8ddd0] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-2">Aking Koleksyon</p>
            <h1 className="font-extrabold text-[#1a1a1a] tracking-tight" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
              Mga Na-save na Tips
            </h1>
            <p className="text-[#6b5e52] text-sm mt-1">
              {savedTips.length === 0 ? 'Wala pang na-save.' : `${savedTips.length} tip${savedTips.length > 1 ? 's' : ''} na na-save mo`}
            </p>
          </div>
          {savedTips.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[#e85d4a] text-xs font-medium hover:underline shrink-0"
            >
              I-clear lahat
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {savedTips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#f5ede0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark size={24} className="text-[#d9c4a0]" />
            </div>
            <h2 className="font-bold text-[#1a1a1a] text-lg mb-2">Wala pang na-save</h2>
            <p className="text-[#6b5e52] text-sm mb-6 max-w-xs mx-auto">
              Mag-browse ng tips at i-click ang "I-save" button para i-bookmark ang mga tip na gusto mo.
            </p>
            <Link
              to="/tips"
              className="inline-flex items-center gap-2 bg-[#f5a623] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#d97706] transition-colors"
            >
              I-browse ang Tips
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTips.map(tip => (
              <TipCard key={tip.id} tip={tip} variant="default" />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
