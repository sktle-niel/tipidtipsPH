import { useEffect, useRef, useState } from 'react'
import { X, Copy, Check, ExternalLink } from 'lucide-react'

interface Props {
  url: string
  title: string
  body: string
  onClose: () => void
}

interface Platform {
  id: string
  label: string
  sublabel: string
  icon: React.ReactNode
  color: string
  bg: string
  action: () => void
}

export default function ShareModal({ url, title, body, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(`${title}\n\n${body.slice(0, 120)}...\n\n${url}`)
  const encodedTitle = encodeURIComponent(title)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function openUrl(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const platforms: Platform[] = [
    {
      id: 'fb-post',
      label: 'Facebook Post',
      sublabel: 'I-share sa timeline',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#fff',
      bg: '#1877F2',
      action: () => openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`),
    },
    {
      id: 'messenger',
      label: 'Messenger',
      sublabel: 'I-send sa friend',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/>
        </svg>
      ),
      color: '#fff',
      bg: '#0099FF',
      action: () => {
        const messengerUrl = /Android|iPhone|iPad/i.test(navigator.userAgent)
          ? `fb-messenger://share/?link=${encodedUrl}`
          : `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=&redirect_uri=${encodedUrl}`
        openUrl(messengerUrl)
      },
    },
    {
      id: 'fb-story',
      label: 'Facebook Story',
      sublabel: 'I-post sa story mo',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#fff',
      bg: '#1877F2',
      action: () => openUrl(`https://www.facebook.com/stories/create?text=${encodedText}`),
    },
    {
      id: 'threads',
      label: 'Threads',
      sublabel: 'I-post sa Threads',
      icon: (
        <svg viewBox="0 0 192 192" fill="currentColor" width="20" height="20">
          <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.105 0h-.113C69.032.195 47.395 9.645 32.8 28.097 19.977 44.514 13.3 67.617 13.01 96.125v.75c.29 28.508 6.967 51.611 19.791 68.028 14.594 18.452 36.232 27.902 64.31 28.097h.112c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.876-24.553zM96.45 128.474c-10.437.587-21.286-4.098-21.82-14.146-.398-7.442 5.276-15.746 22.363-16.735 1.958-.113 3.882-.168 5.772-.168 6.184 0 11.972.606 17.228 1.768-1.96 24.413-13.046 28.692-23.543 29.281z"/>
        </svg>
      ),
      color: '#fff',
      bg: '#000000',
      action: () => openUrl(`https://www.threads.net/intent/post?text=${encodedText}`),
    },
    {
      id: 'instagram',
      label: 'Instagram',
      sublabel: 'I-copy link → i-paste sa IG',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: '#fff',
      bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      action: () => {
        navigator.clipboard.writeText(url)
        alert('Link na-copy! I-paste mo na sa Instagram caption o story mo. 📸')
      },
    },
  ]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function onOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-float-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8ddd0]">
          <div>
            <p className="font-bold text-[#1a1a1a] text-base">I-share ang Tip</p>
            <p className="text-[#a89880] text-xs mt-0.5 line-clamp-1">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5ede0] transition-colors"
          >
            <X size={16} className="text-[#6b5e52]" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={p.action}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-[#e8ddd0] hover:border-transparent hover:shadow-md transition-all group text-left"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                style={{ background: p.bg }}
              >
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1a1a1a] text-sm">{p.label}</p>
                <p className="text-[#a89880] text-xs">{p.sublabel}</p>
              </div>
              <ExternalLink size={13} className="text-[#d9c4a0] group-hover:text-[#6b5e52] transition-colors shrink-0" />
            </button>
          ))}
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 bg-[#faf6f0] rounded-xl border border-[#e8ddd0] p-3">
            <p className="text-[#6b5e52] text-xs flex-1 truncate">{url}</p>
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                copied
                  ? 'bg-[#f0fdf4] text-[#2d6a4f] border border-[#bbf7d0]'
                  : 'bg-[#f5a623] text-white hover:bg-[#d97706]'
              }`}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
