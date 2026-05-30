import { Link } from 'react-router-dom'
import { TrendingUp, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-bold text-white text-base">TipidTips</span>
                <span className="text-[#f5a623] font-bold text-base">.ph</span>
              </div>
            </div>
            <p className="text-[#a89880] text-sm leading-relaxed max-w-xs">
              Araw-araw na money-saving tips para sa mga Pilipino.
              Batay sa weather, presyo ng gasolina, at trending news.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#a89880] mb-4">Mga Pahina</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/tips', label: 'Lahat ng Tips' },
                { to: '/predictions', label: 'Hula ng Presyo' },
                { to: '/about', label: 'Tungkol Sa Amin' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#d9c4a0] hover:text-[#f5a623] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#a89880] mb-4">Mga Kategorya</h4>
            <ul className="space-y-2.5">
              {[
                { label: '🌧️ Panahon at Ulan' },
                { label: '⛽ Gasolina at Fuel' },
                { label: '🥘 Pagkain at Grocery' },
                { label: '💡 Kuryente at LPG' },
                { label: '🚌 Transport at Byahe' },
                { label: '💰 Payday Budgeting' },
              ].map(cat => (
                <li key={cat.label}>
                  <span className="text-[#d9c4a0] text-sm">{cat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3d3530] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6b5e52] text-xs">
            © {year} TipidTips.ph — Para sa mga Pilipino, ng mga Pilipino.
          </p>
          <p className="text-[#6b5e52] text-xs flex items-center gap-1.5">
            Ginawa nang may <Heart size={11} className="text-[#e85d4a] fill-[#e85d4a]" /> sa Pilipinas
          </p>
        </div>
      </div>
    </footer>
  )
}
