/**
 * AI-powered vlog link enricher
 *
 * LIBRE na setup (isa lang ang kailangan):
 *   GEMINI_API_KEY → aistudio.google.com (libre, Google account lang)
 *   Ginagamit ang built-in Google Search ng Gemini — walang Brave needed.
 *
 * Optional alternatives:
 *   BRAVE_SEARCH_API_KEY → brave.com/search/api  (free tier, 2k/month)
 *   ANTHROPIC_API_KEY    → console.anthropic.com  (paid, mas accurate)
 *
 * Run: npm run enrich-vlogs
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local', override: true })

const __dirname  = dirname(fileURLToPath(import.meta.url))
const CACHE_PATH = resolve(__dirname, '../src/data/vlogLinksCache.json')
const DATA_PATH  = resolve(__dirname, '../src/data/foodVlogs.ts')

const GEMINI_KEY    = process.env.GEMINI_API_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const BRAVE_KEY     = process.env.BRAVE_SEARCH_API_KEY

const MODE = GEMINI_KEY ? 'gemini' : ANTHROPIC_KEY && BRAVE_KEY ? 'claude' : BRAVE_KEY ? 'search-only' : null

if (!MODE) {
  console.log('\n⚠️  Walang API key — nilaktawan ang enrichment.')
  console.log('   Para ma-enable: magdagdag ng GEMINI_API_KEY sa .env.local')
  console.log('   (libre sa aistudio.google.com)\n')
  process.exit(0) // graceful — hindi nag-fail ang build
}

const MODE_LABEL: Record<string, string> = {
  gemini:      '✨ Gemini + Google Search (libre)',
  claude:      '⚡ Claude + Brave Search (paid)',
  'search-only': '🔍 Brave search-only (libre, walang AI)',
}
console.log(`\n🤖 Tipid Tips — Vlog Link Enricher`)
console.log(`   Mode: ${MODE_LABEL[MODE]}\n`)

// ── Types ──────────────────────────────────────────────────────────────────

interface VlogInfo {
  id: string
  creatorName: string
  creatorHandle: string
  platform: string
  foodName: string
  restaurantName: string
  location: string
  videoUrl: string
}

// ── Platform helpers ───────────────────────────────────────────────────────

const PLATFORM_DOMAIN: Record<string, string> = {
  youtube:   'youtube.com',
  tiktok:    'tiktok.com',
  facebook:  'facebook.com',
  instagram: 'instagram.com',
}

const VIDEO_PATTERNS: Record<string, RegExp> = {
  youtube:   /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
  tiktok:    /https?:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/\d+/,
  facebook:  /https?:\/\/(?:www\.)?facebook\.com\/(?:reel|watch|videos)\/[\w/?=&]+/,
  instagram: /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p)\/[\w-]+/,
}

function extractVideoUrl(text: string, platform: string): string | null {
  const pattern = VIDEO_PATTERNS[platform]
  if (!pattern) return null
  return text.match(pattern)?.[0] ?? null
}

// ── Gemini + Google Search grounding (LIBRE) ───────────────────────────────

async function findWithGemini(vlog: VlogInfo): Promise<string | null> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(GEMINI_KEY!)

  const prompt = `Search and find the exact ${vlog.platform} video URL for this food content creator post:
Creator: ${vlog.creatorName} (${vlog.creatorHandle})
Food: ${vlog.foodName}
Restaurant: ${vlog.restaurantName}
Location: ${vlog.location}

Find the DIRECT video/post URL — not a search page, not a profile page.
Valid formats:
  YouTube:   https://www.youtube.com/watch?v=XXXX
  TikTok:    https://www.tiktok.com/@user/video/XXXX
  Facebook:  https://www.facebook.com/reel/XXXX
  Instagram: https://www.instagram.com/reel/XXXX

Return ONLY the full URL. If not found, return: none`

  // Try models in order — Gemini 2.0 first, then 1.5
  const attempts = [
    { model: 'gemini-2.0-flash',        tools: [{ googleSearch: {} }] },
    { model: 'gemini-1.5-flash-latest', tools: [{ googleSearchRetrieval: {} }] },
  ] as const

  for (const attempt of attempts) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const model = genAI.getGenerativeModel({ model: attempt.model, tools: attempt.tools as any })
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()

      if (!text || text === 'none') return null

      const url = extractVideoUrl(text, vlog.platform)
      if (url) {
        console.log(`    ✓ Model: ${attempt.model}`)
        return url
      }
      return null
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`  ⚠️  ${attempt.model}: ${msg.slice(0, 100)}`)
    }
  }

  console.warn('  ⚠️  Lahat ng Gemini models ay hindi gumagana.')
  return null
}

// ── Brave Search + optional Claude ────────────────────────────────────────

interface BraveResult { url: string; title: string; description: string }

async function braveSearch(query: string): Promise<BraveResult[]> {
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8`,
    { headers: { 'X-Subscription-Token': BRAVE_KEY!, Accept: 'application/json' } }
  )
  if (!res.ok) { console.warn(`  ⚠️  Brave ${res.status}`); return [] }
  const d = await res.json() as { web?: { results: BraveResult[] } }
  return d.web?.results ?? []
}

async function findWithBrave(vlog: VlogInfo): Promise<string | null> {
  const domain = PLATFORM_DOMAIN[vlog.platform] ?? vlog.platform
  const q = `site:${domain} ${vlog.creatorHandle} ${vlog.foodName}`
  console.log(`    🔎 "${q}"`)

  let results = await braveSearch(q)
  if (!results.length) {
    const q2 = `${vlog.creatorName} ${vlog.foodName} ${vlog.platform} video`
    results = await braveSearch(q2)
  }
  if (!results.length) return null

  if (MODE === 'search-only') {
    return results.find(r => VIDEO_PATTERNS[vlog.platform]?.test(r.url))?.url ?? null
  }

  // Claude to pick best URL
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: ANTHROPIC_KEY })
  const formatted = results.map((r, i) => `${i + 1}. ${r.title}\n   ${r.url}`).join('\n')

  const resp = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 128,
    messages: [{
      role: 'user',
      content: `Pick the direct ${vlog.platform} video URL for ${vlog.creatorName} — "${vlog.foodName}":
${formatted}
Return only the URL or "none".`,
    }],
  })
  const text = (resp.content[0] as { text: string }).text.trim()
  return extractVideoUrl(text, vlog.platform) ?? (text === 'none' ? null : null)
}

// ── Router ─────────────────────────────────────────────────────────────────

async function findVideoUrl(vlog: VlogInfo): Promise<string | null> {
  if (MODE === 'gemini')  return findWithGemini(vlog)
  return findWithBrave(vlog)
}

// ── Parse vlogs ────────────────────────────────────────────────────────────

function parseVlogs(source: string): VlogInfo[] {
  const vlogs: VlogInfo[] = []
  const field = (block: string, key: string) =>
    block.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] ?? ''

  // Match each vlog object by id
  const re = /\{[^{}]*?id:\s*'(fv\d+)'[\s\S]*?\}/g
  for (const m of source.matchAll(re)) {
    const block = m[0]
    vlogs.push({
      id:             m[1],
      creatorName:    field(block, 'creatorName'),
      creatorHandle:  field(block, 'creatorHandle'),
      platform:       field(block, 'platform'),
      foodName:       field(block, 'foodName'),
      restaurantName: field(block, 'restaurantName'),
      location:       field(block, 'location'),
      videoUrl:       field(block, 'videoUrl'),
    })
  }
  return vlogs
}

function isPlaceholder(url: string): boolean {
  try { return new URL(url).pathname.length <= 1 } catch { return true }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const source = readFileSync(DATA_PATH, 'utf-8')
  const vlogs  = parseVlogs(source)
  const cache  = JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) as Record<string, string>

  console.log(`   ${vlogs.length} vlogs found\n`)

  let enriched = 0

  for (const vlog of vlogs) {
    if (cache[vlog.id]) { console.log(`✓  ${vlog.id} (cached)`); continue }
    if (!isPlaceholder(vlog.videoUrl)) {
      cache[vlog.id] = vlog.videoUrl
      console.log(`✓  ${vlog.id} (may real URL na)`)
      continue
    }

    console.log(`\n🔍 ${vlog.id}: ${vlog.creatorName} — "${vlog.foodName}"`)

    try {
      const url = await findVideoUrl(vlog)
      if (url) {
        cache[vlog.id] = url
        console.log(`  ✅ ${url}`)
        enriched++
      } else {
        console.log(`  ⚠️  Walang nahanap`)
      }
    } catch (err) {
      console.error(`  ❌ ${err}`)
    }

    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
    await new Promise(r => setTimeout(r, 1500))
  }

  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
  console.log(`\n✨ Done! ${enriched} bagong links.`)
  console.log(`   npm run build → ma-bake na sa app.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
