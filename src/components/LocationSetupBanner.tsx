import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import { useUserProfile } from '../context/UserProfileContext'
import { useAuth } from '../context/AuthContext'

export default function LocationSetupBanner() {
  const { user } = useAuth()
  const { needsLocationSetup } = useUserProfile()
  const [dismissed, setDismissed] = useState(false)

  if (!user || !needsLocationSetup || dismissed) return null

  return (
    <div className="bg-[#2d6a4f] px-4 py-3 animate-float-up">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
            <MapPin size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">
              I-set ang iyong lokasyon para sa personalized tips
            </p>
            <p className="text-white/60 text-xs hidden sm:block">
              Iba ang tips sa Metro Manila vs probinsya — i-customize ang experience mo.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/setup-location"
            className="inline-flex items-center gap-1.5 bg-[#f5a623] hover:bg-[#d97706] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            I-setup <ArrowRight size={12} />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
