/**
 * AI-powered location-specific tip generator
 *
 * Gumagawa ng 5 personalized na money-saving tips para sa bawat rehiyon ng Pilipinas.
 * Ginagamit ang Gemini AI para gumawa ng content na specific sa lugar.
 *
 * Requires: GEMINI_API_KEY sa .env.local
 * Auto-runs: bago mag build (prebuild hook)
 * Cache TTL: 24 oras — regenerates daily
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local', override: true })

const __dirname  = dirname(fileURLToPath(import.meta.url))
const CACHE_PATH = resolve(__dirname, '../src/data/locationTipsCache.json')

const GROQ_KEY     = process.env.GROQ_API_KEY
const GEMINI_KEY   = process.env.GEMINI_API_KEY
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

const AI_MODE = GROQ_KEY ? 'groq' : GEMINI_KEY ? 'gemini' : null

if (!AI_MODE) {
  console.log('\n⚠️  Walang GROQ_API_KEY o GEMINI_API_KEY — nilaktawan ang tip generation.\n')
  process.exit(0)
}

console.log(`   AI: ${AI_MODE === 'groq' ? '⚡ Groq (Llama 3.3 — libre)' : '✨ Gemini'}`)

// ── Region definitions ─────────────────────────────────────────────────────

const REGIONS: Record<string, { name: string; costLevel: string; context: string }> = {
  '13': {
    name: 'Metro Manila (NCR)',
    costLevel: 'high',
    context: 'Mataas ang cost of living. MRT/LRT at Grab ang pangunahing transpo. Mataas ang renta. Traffic malaking problema. Mas mahal ang pagkain kaysa probinsya. Damang-dama ang inflation dito.',
  },
  '04': {
    name: 'CALABARZON (Laguna, Batangas, Cavite, Rizal, Quezon)',
    costLevel: 'medium',
    context: 'Medyo mura kaysa Manila pero mataas din. Maraming factory workers at OFW families. Jeepney at FX ang transpo. Mas maraming palengke na mura. Buko pie at espesyal na produkto ng bawat probinsya.',
  },
  '03': {
    name: 'Central Luzon (Pampanga, Bulacan, Tarlac, Nueva Ecija, Zambales)',
    costLevel: 'medium',
    context: 'Rice granary ng Pilipinas kaya mas mura ang bigas. Medyo mura ang gulay at prutas. Malapit sa Clark at Subic. Jeepney at tricycle ang transpo. Sikat sa lechon sa Pampanga.',
  },
  '07': {
    name: 'Central Visayas (Cebu City, Lapu-Lapu, Mandaue)',
    costLevel: 'medium',
    context: 'Cebu ay pangalawang pinaka-busy na lungsod. Mas mura ang seafood lalo na ang fresh fish. Carbon Market para sa murang pagkain. V-hire at jeepney ang transpo. Mas mura kaysa Manila pero mas mahal kaysa ibang Visayas.',
  },
  '06': {
    name: 'Western Visayas (Iloilo, Bacolod, Antique, Capiz)',
    costLevel: 'medium',
    context: 'Iloilo at Bacolod ay pangunahing lungsod. Mas mura ang pagkain at seafood. Jeepney at tricycle. La Paz Batchoy at Chicken Inasal ay affordable na authentic food. Mas mababa ang cost of living kaysa Cebu.',
  },
  '11': {
    name: 'Davao Region (Davao City, Tagum, Digos)',
    costLevel: 'medium',
    context: 'Davao City ay tahimik at organisado. Dragon fruit at durian available at mura. Roxas Night Market para sa murang seafood. Habal-habal at jeepney ang transpo. Mababa ang crime rate. Mas affordable kaysa Cebu at Manila.',
  },
  '10': {
    name: 'Northern Mindanao (Cagayan de Oro, Iligan, Butuan)',
    costLevel: 'medium',
    context: 'CDO ay gateway ng Mindanao. Mas mura ang pagkain kaysa Luzon. Jeepney at trisikad. Sinuglaw at seafood ay abot-kaya. Mas mababang cost of living. Mabilis na lumaganap ang ekonomiya.',
  },
  '05': {
    name: 'Bicol Region (Naga, Legazpi, Sorsogon)',
    costLevel: 'low',
    context: 'Mas mababa ang cost of living. Mura ang mga bilihin. Sikat sa laing at Bicol Express. Malapit sa bundok at dagat. Pangunahing transpo ay jeepney at tricycle. Mas affordable ang renta.',
  },
  '01': {
    name: 'Ilocos Region (Ilocos Norte, Ilocos Sur, La Union, Pangasinan)',
    costLevel: 'low',
    context: 'Mura ang mga bilihin. Maraming prutas at gulay. Tricycle at jeepney ang transpo. Sikat sa bagnet at empanada. Pangasinan ay malawak na palayan. Mas mababang presyo ng pagkain kaysa Maynila.',
  },
  '00': {
    name: 'Pilipinas (General)',
    costLevel: 'medium',
    context: 'General tips para sa lahat ng lugar sa Pilipinas. Applicable sa probinsya at lungsod. Focused sa pangkalahatang pagtitipid.',
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────

function isFresh(entry: { generatedAt?: string } | undefined): boolean {
  if (!entry?.generatedAt) return false
  return Date.now() - new Date(entry.generatedAt).getTime() < CACHE_TTL_MS
}

function getTodayContext(): string {
  const now  = new Date()
  const day  = now.toLocaleDateString('en-PH', { weekday: 'long' })
  const date = now.getDate()
  const mon  = now.toLocaleDateString('en-PH', { month: 'long' })
  const year = now.getFullYear()
  const dow  = now.getDay()

  const extras: string[] = []
  if (date === 15 || date === 30 || date === 31) {
    extras.push(`PAYDAY ngayon (ika-${date}) — isama ang isang payday budgeting tip`)
  }
  if (dow === 6 || dow === 0) {
    extras.push('Weekend ngayon — isama ang isang weekend grocery o leisure savings tip')
  }

  return `Ngayon ay ${day}, ${date} ng ${mon} ${year}. ${extras.join('. ')}`
}

// ── AI call (Groq or Gemini) ───────────────────────────────────────────────

async function callAI(prompt: string): Promise<string> {
  if (AI_MODE === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })
    if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`)
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return data.choices?.[0]?.message?.content ?? ''
  }

  // Gemini fallback
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(GEMINI_KEY!)
  const model  = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

async function generateTipsForRegion(
  prefix: string,
  region: typeof REGIONS[string],
): Promise<object[]> {
  const prompt = `Ikaw ay isang Filipino personal finance advisor na nagbibigay ng praktikal na payo.

Gumawa ng 5 money-saving tips para sa isang taong nakatira sa ${region.name}, Pilipinas.

${getTodayContext()}
Cost of living ng lugar: ${region.costLevel}
Konteksto ng lugar: ${region.context}

I-return ang PURE JSON ARRAY lamang — walang markdown, walang explanation, JSON array lang:
[
  {
    "title": "Maikling Taglish title na catchy (max 65 characters)",
    "body": "3-4 sentences ng praktikal na payo sa Taglish. Maging SPECIFIC sa ${region.name} — banggitin ang lokal na presyo, lugar, transpo, o sitwasyon na naaangkop sa lugar na ito. Huwag generic.",
    "category": "isa sa: weather|fuel|food|transport|electricity|payday|general|emergency",
    "tags": ["tag1", "tag2", "tag3"]
  }
]

Rules:
- 5 tips total, iba-ibang category (huwag paulit-ulit ang category)
- Taglish — natural na Filipino-English mix
- Specific sa ${region.name}, hindi generic "sa Pilipinas"
- May presyo o numero kung posible (e.g., "₱50", "30%", "₱15 lang")
- Actionable — may konkretong hakbang`

  try {
    const text = await callAI(prompt)
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) { console.warn('  ⚠️  Walang JSON sa response'); return [] }

    const raw = JSON.parse(jsonMatch[0]) as Array<Record<string, unknown>>
    return raw.map((tip, i) => ({
      id:               `loc-${prefix}-${i + 1}`,
      title:            tip.title ?? '',
      body:             tip.body ?? '',
      category:         tip.category ?? 'general',
      tags:             tip.tags ?? [],
      sourceTrigger:    'ai-location',
      targetCostLevels: region.costLevel === 'high' ? ['high'] : region.costLevel === 'low' ? ['low', 'medium'] : ['medium', 'high', 'low'],
      createdAt:        new Date().toISOString(),
      publishedAt:      new Date().toISOString(),
      isPublished:      true,
      isFeatured:       i === 0,
    }))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`  ⚠️  ${msg.slice(0, 100)}`)
    return []
  }
}

// ── Prediction generation ──────────────────────────────────────────────────

const PRED_CACHE_PATH = resolve(__dirname, '../src/data/locationPredictionsCache.json')

async function generatePredictionsForRegion(
  prefix: string,
  region: typeof REGIONS[string],
): Promise<object[]> {
  const prompt = `Ikaw ay isang Filipino economic at weather analyst.

Gumawa ng 3 predictions (hula) para sa isang taong nakatira sa ${region.name}, Pilipinas.

${getTodayContext()}
Cost of living ng lugar: ${region.costLevel}
Konteksto ng lugar: ${region.context}

I-return ang PURE JSON ARRAY lamang — walang markdown, walang explanation:
[
  {
    "type": "isa sa: fuel|weather|food|electricity|transport",
    "summary": "Maikling Taglish na hula (max 60 characters)",
    "detail": "2-3 sentences ng detalye sa Taglish. SPECIFIC sa ${region.name} — banggitin ang lokal na epekto, presyo, o lugar. May konkretong numero o timeframe.",
    "confidenceLevel": "isa sa: low|medium|high",
    "validDays": 2
  }
]

Rules:
- 3 predictions total, iba-ibang type
- Specific sa ${region.name} — ang weather, presyo, o sitwasyon sa lugar na ito
- Actionable — may konkretong payo kung paano maghanda
- Natural na Taglish`

  try {
    const text = await callAI(prompt)
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) { console.warn('  ⚠️  Walang JSON sa prediction response'); return [] }

    const raw = JSON.parse(jsonMatch[0]) as Array<Record<string, unknown>>
    return raw.map((p, i) => ({
      id:              `pred-${prefix}-${i + 1}`,
      type:            p.type ?? 'general',
      summary:         p.summary ?? '',
      detail:          p.detail ?? '',
      confidenceLevel: p.confidenceLevel ?? 'medium',
      validUntil:      new Date(Date.now() + Number(p.validDays ?? 2) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt:       new Date().toISOString(),
    }))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`  ⚠️  Prediction error: ${msg.slice(0, 80)}`)
    return []
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🤖 Tipid Tips — Location Tips + Predictions Generator')

  const raw      = readFileSync(CACHE_PATH, 'utf-8')
  const cache    = JSON.parse(raw) as { generatedDate: string; regions: Record<string, { generatedAt: string; tips: object[] }> }
  const predRaw  = readFileSync(PRED_CACHE_PATH, 'utf-8')
  const predCache = JSON.parse(predRaw) as { generatedDate: string; regions: Record<string, { generatedAt: string; predictions: object[] }> }

  let generated = 0

  for (const [prefix, region] of Object.entries(REGIONS)) {
    const tipsFresh  = isFresh(cache.regions[prefix])
    const predsFresh = isFresh(predCache.regions[prefix])

    if (tipsFresh && predsFresh) {
      console.log(`✓  ${region.name} (fresh)`)
      continue
    }

    console.log(`\n📍 ${region.name}...`)

    if (!tipsFresh) {
      const tips = await generateTipsForRegion(prefix, region)
      if (tips.length > 0) {
        cache.regions[prefix] = { generatedAt: new Date().toISOString(), tips }
        console.log(`  ✅ ${tips.length} tips`)
      }
      writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
      await new Promise(r => setTimeout(r, 1500))
    }

    if (!predsFresh) {
      const predictions = await generatePredictionsForRegion(prefix, region)
      if (predictions.length > 0) {
        predCache.regions[prefix] = { generatedAt: new Date().toISOString(), predictions }
        console.log(`  ✅ ${predictions.length} predictions`)
        generated++
      }
      writeFileSync(PRED_CACHE_PATH, JSON.stringify(predCache, null, 2))
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  const today = new Date().toISOString().split('T')[0]
  cache.generatedDate    = today
  predCache.generatedDate = today
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
  writeFileSync(PRED_CACHE_PATH, JSON.stringify(predCache, null, 2))

  console.log(`\n✨ Done! ${generated} bagong region predictions.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
