import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, loading, signInWithGoogle, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 bg-[#f5a623] rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-[#1a1a1a] text-xl tracking-tight">TipidTips</span>
              <span className="text-[#f5a623] font-bold text-xl">.ph</span>
            </div>
          </Link>

          <h1 className="font-extrabold text-[#1a1a1a] text-2xl mt-5 mb-1 tracking-tight">
            Mag-login para makatipid
          </h1>
          <p className="text-[#6b5e52] text-sm leading-relaxed">
            I-save ang iyong mga paboritong tips at makakuha ng personalized na money-saving advice.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-[#fff1f0] border border-[#fecaca] rounded-xl px-4 py-3 mb-5 animate-float-up">
            <AlertCircle size={15} className="text-[#e85d4a] shrink-0 mt-0.5" />
            <p className="text-[#e85d4a] text-sm">{error}</p>
            <button onClick={clearError} className="ml-auto text-[#e85d4a] hover:opacity-70 text-lg leading-none shrink-0">×</button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e8ddd0] p-6 shadow-sm space-y-3">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-[#e8ddd0] hover:border-[#d9c4a0] hover:shadow-md transition-all group bg-white"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white border border-[#e8ddd0]">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-[#1a1a1a] text-sm">Ituloy sa Google</p>
              <p className="text-[#a89880] text-xs">Mabilis at ligtas</p>
            </div>
            <span className="text-[#d9c4a0] text-xs group-hover:text-[#6b5e52] transition-colors">→</span>
          </button>

          <div className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-[#e8ddd0] bg-[#faf6f0] opacity-60 cursor-not-allowed">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#1877F2]/50">
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-[#a89880] text-sm">Ituloy sa Facebook</p>
              <p className="text-[#a89880] text-xs">Gamitin ang iyong FB account</p>
            </div>
            <span className="bg-[#f5ede0] text-[#b45309] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-start gap-2 text-[#a89880] text-xs">
            <span className="text-[#2d6a4f] mt-0.5 shrink-0">✓</span>
            I-save ang iyong paboritong tips
          </div>
          <div className="flex items-start gap-2 text-[#a89880] text-xs">
            <span className="text-[#2d6a4f] mt-0.5 shrink-0">✓</span>
            Makakuha ng personalized na daily tips
          </div>
          <div className="flex items-start gap-2 text-[#a89880] text-xs">
            <span className="text-[#2d6a4f] mt-0.5 shrink-0">✓</span>
            Hindi namin ibebenta ang iyong data
          </div>
        </div>

        <p className="text-center text-[#a89880] text-xs mt-6 leading-relaxed">
          Sa pag-login, sumasang-ayon ka sa aming{' '}
          <span className="text-[#6b5e52] font-medium cursor-pointer hover:underline">Terms of Service</span>
          {' '}at{' '}
          <span className="text-[#6b5e52] font-medium cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </main>
  )
}
