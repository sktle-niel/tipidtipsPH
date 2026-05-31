import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, LogOut, ChevronDown, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUserProfile } from '../context/UserProfileContext'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { profile } = useUserProfile()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) return null

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'User'
  const photoURL = user.photoURL
  const location = profile?.setupCompleted ? (profile.cityName || profile.regionName) : null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#f5ede0] transition-colors group"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-[#e8ddd0]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#f5a623] flex items-center justify-center text-white text-xs font-bold">
            {displayName[0].toUpperCase()}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-[#3d3530] text-sm font-medium max-w-[100px] truncate leading-tight">{displayName}</p>
          {location && (
            <p className="text-[#a89880] text-[10px] flex items-center gap-0.5 leading-tight">
              <MapPin size={9} /> {location}
            </p>
          )}
        </div>
        <ChevronDown size={13} className={`text-[#a89880] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#e8ddd0] shadow-xl py-1.5 z-50 animate-float-up">
          <div className="px-4 py-3 border-b border-[#f5ede0]">
            <p className="font-semibold text-[#1a1a1a] text-sm truncate">{displayName}</p>
            <p className="text-[#a89880] text-xs truncate mt-0.5">{user.email}</p>
            {location && (
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin size={10} className="text-[#2d6a4f]" />
                <p className="text-[#2d6a4f] text-xs font-medium">{location}</p>
              </div>
            )}
          </div>

          <div className="py-1.5">
            <Link
              to="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3d3530] hover:bg-[#faf6f0] transition-colors"
            >
              <Bookmark size={14} className="text-[#2d6a4f]" />
              Mga Na-save na Tips
            </Link>
            <Link
              to="/setup-location"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3d3530] hover:bg-[#faf6f0] transition-colors"
            >
              <MapPin size={14} className="text-[#f5a623]" />
              {location ? 'Baguhin ang Lokasyon' : 'I-set ang Lokasyon'}
            </Link>
          </div>

          <div className="border-t border-[#f5ede0] pt-1.5 pb-1">
            <button
              onClick={() => { signOut(); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#e85d4a] hover:bg-[#fff1f0] transition-colors"
            >
              <LogOut size={14} />
              Mag-logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
