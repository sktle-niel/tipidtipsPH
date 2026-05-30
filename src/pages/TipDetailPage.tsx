import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from 'lucide-react'
import { MOCK_TIPS, getCategoryInfo, formatDate } from '../data/mockData'
import CategoryBadge from '../components/CategoryBadge'
import TipCard from '../components/TipCard'
import ShareModal from '../components/ShareModal'
import { useSavedTips } from '../hooks/useSavedTips'

export default function TipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [showShare, setShowShare] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const { isSaved, toggle } = useSavedTips()

  const tip = MOCK_TIPS.find(t => t.id === id)
  const catInfo = tip ? getCategoryInfo(tip.category) : null
  if (!tip || !catInfo) {
    return (
      <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🤔</p>
          <h1 className="font-bold text-[#1a1a1a] text-xl mb-2">Hindi mahanap ang tip</h1>
          <Link to="/tips" className="text-[#2d6a4f] text-sm font-semibold hover:underline">
            ← Bumalik sa lahat ng tips
          </Link>
        </div>
      </main>
    )
  }

  const related = MOCK_TIPS.filter(t => t.id !== id && t.category === tip.category).slice(0, 3)
  const tipId = tip.id
  const saved = isSaved(tipId)
  const pageUrl = window.location.href

  function handleSave() {
    toggle(tipId)
    if (!saved) {
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-[#faf6f0]">
      <div className="py-12 md:py-16" style={{ background: catInfo.bgColor, borderBottom: `1px solid ${catInfo.borderColor}` }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            to="/tips"
            className="inline-flex items-center gap-1.5 text-[#6b5e52] hover:text-[#1a1a1a] text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Bumalik sa Tips
          </Link>

          <div className="mb-4">
            <CategoryBadge category={tip.category} />
          </div>

          <h1
            className="font-extrabold text-[#1a1a1a] leading-tight tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)' }}
          >
            {tip.title}
          </h1>

          <div className="flex items-center justify-between gap-4">
            <p className="text-[#a89880] text-sm">{formatDate(tip.publishedAt)}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-1.5 text-[#6b5e52] hover:text-[#1a1a1a] text-xs font-medium border border-[#e8ddd0] bg-white px-3 py-1.5 rounded-lg transition-colors hover:border-[#d9c4a0] hover:shadow-sm"
              >
                <Share2 size={12} /> I-share
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm ${
                  saved
                    ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                    : 'text-[#6b5e52] border-[#e8ddd0] bg-white hover:text-[#1a1a1a] hover:border-[#d9c4a0]'
                }`}
              >
                {saved
                  ? <><BookmarkCheck size={12} /> Na-save na!</>
                  : <><Bookmark size={12} /> I-save</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {justSaved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-float-up">
          <div className="bg-[#2d6a4f] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
            <BookmarkCheck size={15} />
            Na-save ang tip! 🎉
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e8ddd0] mb-8">
          <p className="text-[#3d3530] text-lg leading-relaxed">{tip.body}</p>
        </div>

        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-5 mb-8">
          <p className="text-xs font-bold text-[#b45309] uppercase tracking-wider mb-2">Bakit ito importante?</p>
          <p className="text-[#6b5e52] text-sm leading-relaxed">
            Ang tip na ito ay batay sa <strong className="text-[#1a1a1a]">{tip.sourceTrigger}</strong> — isang pattern na nakita namin sa data. Kapag nangyari ito, nakakaapekto ito sa pang-araw-araw na gastos ng mga Pilipino.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold text-[#a89880] uppercase tracking-wider mb-3">Mga Tags</p>
          <div className="flex flex-wrap gap-2">
            {tip.tags.map(tag => (
              <span key={tag} className="bg-[#f5ede0] text-[#6b5e52] text-xs font-medium px-3 py-1.5 rounded-full border border-[#e8ddd0]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-bold text-[#1a1a1a] text-lg mb-4">Mga Related na Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(t => (
                <TipCard key={t.id} tip={t} variant="default" />
              ))}
            </div>
          </div>
        )}
      </div>

      {showShare && (
        <ShareModal
          url={pageUrl}
          title={tip.title}
          body={tip.body}
          onClose={() => setShowShare(false)}
        />
      )}
    </main>
  )
}
