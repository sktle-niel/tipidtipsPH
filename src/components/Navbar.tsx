import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, TrendingUp, Bookmark, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import UserMenu from './UserMenu'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/tips', label: 'Lahat ng Tips' },
  { to: '/predictions', label: 'Hula ng Presyo' },
  { to: '/about', label: 'Tungkol Sa Amin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-[#faf6f0]/90 backdrop-blur-md border-b border-[#e8ddd0]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-[#1a1a1a] text-base tracking-tight">TipidTips</span>
            <span className="text-[#f5a623] font-bold text-base">.ph</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-[#2d6a4f] text-white'
                  : 'text-[#3d3530] hover:bg-[#f5ede0] hover:text-[#1a1a1a]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {!loading && (
            user ? (
              <>
                <Link
                  to="/saved"
                  className="flex items-center gap-1.5 text-[#6b5e52] hover:text-[#2d6a4f] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#f5ede0] transition-colors"
                  title="Mga na-save"
                >
                  <Bookmark size={15} />
                  Na-save
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-[#3d3530] hover:text-[#1a1a1a] text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-[#f5ede0] transition-colors"
                >
                  <LogIn size={14} />
                  Mag-login
                </Link>
                <Link
                  to="/tips"
                  className="bg-[#f5a623] hover:bg-[#d97706] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Makita ang Tips →
                </Link>
              </>
            )
          )}
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f5ede0] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[#e8ddd0] bg-[#faf6f0] px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-[#2d6a4f] text-white'
                  : 'text-[#3d3530] hover:bg-[#f5ede0]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!loading && user && (
            <Link
              to="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#3d3530] hover:bg-[#f5ede0] transition-colors"
            >
              <Bookmark size={14} /> Mga Na-save na Tips
            </Link>
          )}

          <div className="border-t border-[#e8ddd0] mt-1 pt-2">
            {!loading && (
              user ? (
                <div className="flex items-center gap-3 px-4 py-2.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#f5a623] flex items-center justify-center text-white text-xs font-bold">
                      {(user.displayName ?? 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#1a1a1a] truncate flex-1">
                    {user.displayName ?? user.email}
                  </span>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#f5a623] text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                >
                  <LogIn size={14} /> Mag-login
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
