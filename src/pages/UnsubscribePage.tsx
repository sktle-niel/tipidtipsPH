import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { unsubscribeEmail, tokenToEmail } from '../services/subscribeService'

type Status = 'loading' | 'success' | 'invalid' | 'error'

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')
  const [email, setEmail] = useState('')

  const token = searchParams.get('token') ?? ''

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }

    const decoded = tokenToEmail(token)
    if (!decoded) {
      setStatus('invalid')
      return
    }

    setEmail(decoded)

    unsubscribeEmail(token).then(result => {
      setStatus(result === 'success' ? 'success' : result === 'invalid' ? 'invalid' : 'error')
    })
  }, [token])

  return (
    <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm text-center">
        <Link to="/" className="inline-flex flex-col items-center gap-3 mb-10 group">
          <div className="w-12 h-12 bg-[#f5a623] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <TrendingUp size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-[#1a1a1a] text-lg tracking-tight">TipidTips</span>
            <span className="text-[#f5a623] font-bold text-lg">.ph</span>
          </div>
        </Link>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="text-[#f5a623] animate-spin" />
            <p className="text-[#6b5e52] text-sm">Sandali lang...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl border border-[#e8ddd0] p-8 shadow-sm animate-float-up">
            <div className="w-14 h-14 bg-[#f0fdf4] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-[#2d6a4f]" />
            </div>
            <h1 className="font-extrabold text-[#1a1a1a] text-xl mb-2 tracking-tight">
              Na-unsubscribe ka na
            </h1>
            <p className="text-[#6b5e52] text-sm leading-relaxed mb-1">
              Ang <strong className="text-[#1a1a1a]">{email}</strong> ay
              tinanggal na sa aming mailing list.
            </p>
            <p className="text-[#a89880] text-xs mb-6">
              Hindi ka na makakatanggap ng mga tips mula sa TipidTips.ph.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#2d6a4f] text-sm font-semibold hover:underline"
            >
              ← Bumalik sa homepage
            </Link>
          </div>
        )}

        {status === 'invalid' && (
          <div className="bg-white rounded-2xl border border-[#e8ddd0] p-8 shadow-sm animate-float-up">
            <div className="w-14 h-14 bg-[#fff1f0] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <XCircle size={28} className="text-[#e85d4a]" />
            </div>
            <h1 className="font-extrabold text-[#1a1a1a] text-xl mb-2 tracking-tight">
              Invalid na link
            </h1>
            <p className="text-[#6b5e52] text-sm leading-relaxed mb-6">
              Ang unsubscribe link na ito ay hindi valid o expired na.
              Subukan ulit mula sa email na natanggap mo.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#2d6a4f] text-sm font-semibold hover:underline"
            >
              ← Bumalik sa homepage
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl border border-[#e8ddd0] p-8 shadow-sm animate-float-up">
            <div className="w-14 h-14 bg-[#fff1f0] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <XCircle size={28} className="text-[#e85d4a]" />
            </div>
            <h1 className="font-extrabold text-[#1a1a1a] text-xl mb-2 tracking-tight">
              May error
            </h1>
            <p className="text-[#6b5e52] text-sm leading-relaxed mb-6">
              Hindi namin ma-process ang iyong request ngayon.
              Subukan ulit mamaya o mag-reply sa email na natanggap mo.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#2d6a4f] text-sm font-semibold hover:underline"
            >
              ← Bumalik sa homepage
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
