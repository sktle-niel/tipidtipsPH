import { useState } from 'react'
import { ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { subscribeEmail } from '../services/subscribeService'

type Status = 'idle' | 'loading' | 'success' | 'already' | 'error'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const result = await subscribeEmail(email)
      if (result.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('already')
        setMessage(result.message)
      }
    } catch (err) {
      console.error('Subscribe error:', err)
      setStatus('error')
      setMessage('May error. Subukan ulit mamaya.')
    }
  }

  return (
    <section className="py-20 md:py-28 bg-[#faf6f0] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-extrabold text-[#f5a623] opacity-[0.06] leading-none"
          style={{ fontSize: 'clamp(10rem, 30vw, 22rem)', letterSpacing: '-0.05em' }}
        >
          ₱
        </span>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[#f5a623] text-xs font-bold uppercase tracking-widest mb-4">
          Daily Tipid Digest
        </p>

        <h2
          className="font-extrabold text-[#1a1a1a] leading-tight tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}
        >
          Makuha ang tip
          <br />
          <span className="text-[#2d6a4f]">bago pa mahal ang lahat.</span>
        </h2>

        <p className="text-[#6b5e52] text-base leading-relaxed mb-8 max-w-md mx-auto">
          Mag-subscribe sa aming daily newsletter. Libreng tips every morning — weather forecast, fuel update, at budget reminders para sa araw mo.
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-2.5 bg-[#f0fdf4] border border-[#bbf7d0] text-[#2d6a4f] font-semibold px-6 py-3.5 rounded-xl animate-float-up">
            <CheckCircle size={18} />
            Na-subscribe ka na! Abangan ang tips bukas. 🎉
          </div>
        ) : status === 'already' ? (
          <div className="flex flex-col items-center gap-3 animate-float-up">
            <div className="inline-flex items-center gap-2.5 bg-[#eff6ff] border border-[#bfdbfe] text-[#1d6fa4] font-semibold px-6 py-3.5 rounded-xl">
              <span className="text-lg">📬</span>
              {message}
            </div>
            <button
              onClick={() => { setStatus('idle'); setEmail('') }}
              className="text-[#a89880] text-xs hover:text-[#6b5e52] underline underline-offset-2 transition-colors"
            >
              Gumamit ng ibang email
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
                placeholder="email@example.com"
                required
                disabled={status === 'loading'}
                className="flex-1 bg-white border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#a89880] focus:outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20 transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d97706] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <><Loader2 size={14} className="animate-spin" /> Sandali lang...</>
                ) : (
                  <>Mag-subscribe <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            {status === 'error' && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl animate-float-up bg-[#fff1f0] border border-[#fecaca] text-[#e85d4a]">
                <AlertCircle size={14} />
                {message}
              </div>
            )}
          </>
        )}

        <p className="text-[#a89880] text-xs mt-4">
          Libre. Walang spam. I-unsubscribe kahit kailan.
        </p>

        <div className="mt-12 pt-10 border-t border-[#e8ddd0] grid grid-cols-3 gap-6">
          {[
            { value: '50+', label: 'Tips na published' },
            { value: '8', label: 'Mga kategorya' },
            { value: 'Libre', label: 'Palagi' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-extrabold text-[#1a1a1a] text-2xl tracking-tight">{stat.value}</p>
              <p className="text-[#a89880] text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
