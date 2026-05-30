import { TrendingUp, CloudRain, Fuel, ShoppingBag, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf6f0]">
      <div className="bg-[#2d6a4f] py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-[#f5a623] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-extrabold text-white leading-tight tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Tungkol Sa TipidTips.ph
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-md mx-auto">
            Ginawa para sa mga Pilipinong gusto mag-ipon kahit gaano kahirap ang sitwasyon.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e8ddd0]">
          <h2 className="font-bold text-[#1a1a1a] text-xl mb-4">Bakit ginawa namin ito?</h2>
          <p className="text-[#6b5e52] text-base leading-relaxed mb-4">
            Napagtanto namin na ang mga Pilipino ay kailangang mag-adjust ng budget araw-araw — depende sa panahon, presyo ng gasolina, at iba pang factors. Pero walang isang lugar para makuha ang lahat ng impormasyong ito nang simple at praktikal.
          </p>
          <p className="text-[#6b5e52] text-base leading-relaxed">
            Kaya ginawa namin ang <strong className="text-[#1a1a1a]">TipidTips.ph</strong> — isang website na awtomatikong nag-ge-generate ng money-saving tips batay sa real data.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-[#1a1a1a] text-xl mb-5">Paano gumagana ang sistema?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: CloudRain,
                title: 'Weather Data',
                body: 'Nag-a-analyze kami ng daily weather forecasts — ulan, init, bagyo — para ma-predict ang epekto sa pamasahe at gastos.',
                color: '#1d6fa4',
                bg: '#eff6ff',
              },
              {
                icon: Fuel,
                title: 'Fuel & Economy News',
                body: 'Binabasa namin ang mga balita tungkol sa presyo ng gasolina, LPG, at inflation para mag-alert tayo nang maaga.',
                color: '#b45309',
                bg: '#fffbeb',
              },
              {
                icon: ShoppingBag,
                title: 'Market Trends',
                body: 'Tinitingnan namin ang mga trending searches sa Pilipinas para malaman ang pinaka-pressing na money concerns.',
                color: '#2d6a4f',
                bg: '#f0fdf4',
              },
              {
                icon: Zap,
                title: 'AI Content Generation',
                body: 'Gumagamit kami ng Claude AI para gumawa ng Taglish na tips na praktikal, madaling intindihin, at relevant sa buhay ng Pilipino.',
                color: '#d97706',
                bg: '#fefce8',
              },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-2xl p-5 border"
                style={{ background: item.bg, borderColor: `${item.color}30` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <h3 className="font-bold text-[#1a1a1a] text-sm mb-1.5">{item.title}</h3>
                <p className="text-[#6b5e52] text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
