    # Tipid Tips PH — Project TODO

> MVP-first approach: rule-based logic first, then upgrade to AI predictions.
> Stack: React/Vite (frontend) · Fastify + TypeScript (backend) · MySQL (database) · Render (deploy)

---

## PHASE 0 — Project Setup

- [ ] Initialize monorepo structure: `/client`, `/server`, `/shared`
- [ ] Set up Vite + React + TypeScript in `/client`
- [ ] Set up Fastify + TypeScript in `/server`
- [ ] Set up MySQL database (local dev + Render production)
- [ ] Configure `.env` files for API keys (weather, news, AI)
- [ ] Set up ESLint + Prettier across workspace
- [ ] Initialize Git repository
- [ ] Deploy blank app to Render to confirm pipeline works

---

## PHASE 1 — Database Schema

- [ ] Create `tips` table
  - `id`, `title`, `body`, `category`, `tags`, `source_trigger`, `language` (`tl`/`en`/`taglish`), `created_at`, `published_at`, `is_published`
- [ ] Create `predictions` table
  - `id`, `type` (fuel/weather/food/electricity), `summary`, `confidence_level`, `valid_until`, `created_at`
- [ ] Create `data_sources` table
  - `id`, `source_name`, `api_url`, `last_fetched`, `status`, `raw_payload` (JSON)
- [ ] Create `trends` table
  - `id`, `keyword`, `trend_score`, `region` (PH), `fetched_at`
- [ ] Write migration scripts for all tables
- [ ] Seed database with 10 sample tips for dev testing

---

## PHASE 2 — Data Collection Layer (APIs)

### Weather
- [ ] Register for Open-Meteo API (free, no key needed) or OpenWeatherMap free tier
- [ ] Write `fetchWeather.ts` — fetch daily weather for Metro Manila + major PH cities
- [ ] Extract: temperature, rain probability, typhoon signals
- [ ] Save result to `data_sources` table

### News / Economy
- [ ] Register for NewsAPI.org (free tier)
- [ ] Write `fetchNews.ts` — fetch PH news filtered by keywords:
  - `"fuel price Philippines"`, `"LPG price"`, `"inflation Philippines"`, `"electricity rate"`, `"transport fare"`
- [ ] Parse top 5 headlines per day, save to `data_sources`

### Google Trends
- [ ] Use `google-trends-api` npm package (unofficial but legal/public data)
- [ ] Write `fetchTrends.ts` — fetch daily trending searches in PH
- [ ] Save top 10 trends to `trends` table

### LPG / Fuel Prices
- [ ] Check DOE (Department of Energy) public data portal: `doe.gov.ph`
- [ ] Write `fetchFuelPrices.ts` — scrape or pull from DOE public API if available
- [ ] Fallback: use news headlines as proxy signal

---

## PHASE 3 — Rule-Based Analysis Layer (MVP Core Logic)

Write `analyzeData.ts` with these rules (simple IF/THEN):

- [ ] **Rain rule**: `IF rain_probability > 60% → trigger "magbaon tip" + "transport cost tip"`
- [ ] **Heat rule**: `IF temperature > 35°C → trigger "tipid kuryente tip" + "hydration tip"`
- [ ] **Fuel rule**: `IF fuel news detected in headlines → trigger "tipid byahe tip"`
- [ ] **Payday rule**: `IF date is 15th or 30th → trigger "payday budgeting tip"`
- [ ] **LPG rule**: `IF LPG price trend is rising → trigger "cooking cost tip"`
- [ ] **Typhoon rule**: `IF weather signal >= Signal 1 → trigger "emergency budget tip"`
- [ ] **Weekend rule**: `IF day is Saturday/Sunday → trigger "weekend grocery tip"`

Each rule should return a `TriggerEvent` object passed to the content generation layer.

---

## PHASE 4 — Prediction Layer

Write `generatePredictions.ts`:

- [ ] Fuel prediction: `IF 3+ fuel-related headlines in 2 days → "possible fuel price change soon"`
- [ ] Electricity prediction: `IF avg temp > 34°C for 3 days → "expect higher electricity bills"`
- [ ] Food price prediction: `IF typhoon signal OR heavy rain > 2 days → "possible food price spike"`
- [ ] Transport prediction: `IF fuel price news + rain → "expect higher Grab/transport fares"`
- [ ] Save each prediction to `predictions` table with `valid_until` = +2 days
- [ ] Expose predictions via API endpoint `GET /api/predictions/latest`

---

## PHASE 5 — Content Generation Layer

### Option A: Rule-Based Templates (Start Here)
- [ ] Write `generateTipContent.ts` with Taglish tip templates per trigger type
- [ ] Each template has: title, body (3–5 sentences), category, SEO tags
- [ ] Randomize phrasing slightly to avoid duplicate content

### Option B: AI-Assisted (Upgrade Later)
- [ ] Integrate Claude API (`claude-sonnet-4-6` model)
- [ ] Write prompt template that sends: trigger type + weather data + news headline
- [ ] Claude returns: Taglish tip title + body + SEO meta description
- [ ] Add rate limiting (max 10 AI generations/day to control costs)
- [ ] Toggle between template mode and AI mode via `.env` flag `USE_AI=true/false`

### Content Rules (Both Options)
- [ ] Length: 3–6 sentences
- [ ] Language: Taglish (Filipino + English mix)
- [ ] Must include a reason or prediction
- [ ] Must include at least 1 actionable tip
- [ ] SEO: include keywords like "tipid tips", "Philippines", "pagtitipid", "budget tips"

---

## PHASE 6 — Automation (Cron Jobs)

Write scheduled tasks in `/server/jobs/`:

- [ ] `dailyDataFetch.ts` — runs at **6:00 AM PHT** daily
  - Fetch weather, news, trends, fuel data
- [ ] `dailyAnalysis.ts` — runs at **6:30 AM PHT** daily
  - Run rule-based analysis on fresh data
  - Generate predictions
- [ ] `dailyContentGen.ts` — runs at **7:00 AM PHT** daily
  - Generate 3–5 tips based on triggered rules
  - Save to `tips` table with `is_published = false`
- [ ] `publishContent.ts` — runs at **8:00 AM PHT** daily
  - Set `is_published = true` for today's tips
  - Optionally post to social (future phase)
- [ ] Use `node-cron` or Render Cron Jobs for scheduling
- [ ] Add logging for each job (success/failure + timestamp)

---

## PHASE 7 — Backend API Endpoints

- [ ] `GET /api/tips` — list published tips (paginated, latest first)
- [ ] `GET /api/tips/:id` — single tip detail
- [ ] `GET /api/tips/today` — today's tips only
- [ ] `GET /api/predictions/latest` — latest active predictions
- [ ] `GET /api/trends` — current PH trending topics
- [ ] `GET /api/categories` — list of tip categories
- [ ] `POST /api/admin/generate` — manually trigger content generation (auth protected)
- [ ] Add rate limiting to all public endpoints
- [ ] Add CORS for frontend domain

---

## PHASE 8 — Frontend (React + Vite)

### Pages
- [ ] **Home** (`/`) — today's tips, prediction banner, trending topics
- [ ] **Tips Archive** (`/tips`) — all tips, filterable by category
- [ ] **Tip Detail** (`/tips/:id`) — full tip + SEO meta tags
- [ ] **Predictions** (`/predictions`) — current predictions with explanations
- [ ] **About** (`/about`) — project info, mission

### Components
- [ ] `TipCard` — displays one tip (title, preview, category badge, date)
- [ ] `PredictionBanner` — highlighted prediction strip at top of page
- [ ] `TrendingBar` — horizontal scroll of today's trending PH topics
- [ ] `CategoryFilter` — filter tips by category
- [ ] `AdPlaceholder` — reserved slots for Google Ads
- [ ] `SEOHead` — dynamic meta tags per page for SEO

### UI Requirements
- [ ] Mobile-first responsive design
- [ ] Fast load time (target < 2s)
- [ ] Filipino color palette (warm, approachable)
- [ ] Taglish UI copy throughout

---

## PHASE 9 — SEO Strategy

- [ ] Set up `react-helmet-async` for dynamic meta tags
- [ ] Each tip page has unique: `<title>`, `<meta description>`, `<og:image>`
- [ ] Generate `sitemap.xml` automatically from published tips
- [ ] Add `robots.txt`
- [ ] Target long-tail keywords: `"tipid tips Philippines 2025"`, `"paano makatipid sa kuryente"`, `"bakit mahal pamasahe"`, `"budget tips Pilipino"`
- [ ] Publish minimum 5 tips/day for content velocity
- [ ] Add structured data (JSON-LD) for articles

---

## PHASE 10 — Google Ads Setup

- [ ] Apply for Google AdSense once site has 20+ published tips
- [ ] Place ads in these slots:
  - After tip #1 on home page
  - Middle of tip detail page
  - Bottom of tips archive page
- [ ] Use responsive ad units (auto-size for mobile)
- [ ] Avoid placing ads near navigation or CTAs (AdSense policy)
- [ ] Monitor RPM and adjust placement based on performance

---

## PHASE 11 — Viral / Social Strategy (Bonus)

- [ ] Design shareable tip image cards (text on image, 1080x1080px)
- [ ] Auto-generate card images using `canvas` or `sharp` library
- [ ] Add "Share to Facebook" button on each tip (no API needed — use share URL)
- [ ] Post daily tip image manually to Facebook Page (automate later via Meta API)
- [ ] Use question-style titles to drive engagement: `"Bakit mas mahal pagkain pag tag-ulan?"`
- [ ] Pin top tip of the day to Facebook Page cover

---

## PHASE 12 — Scaling to 10,000+ Daily Visitors

- [ ] Add Redis caching for API responses (reduce DB load)
- [ ] Implement CDN (Cloudflare free tier) for static assets
- [ ] Generate static pages for top tips (SSG or ISR)
- [ ] Monitor Core Web Vitals in Google Search Console
- [ ] Build email newsletter (weekly "Tipid Roundup" — use Resend or Brevo free tier)
- [ ] Add push notifications (PWA) for daily tips
- [ ] Expand coverage: add city-specific tips (Cebu, Davao, etc.)
- [ ] Partner with PH personal finance blogs for backlinks

---

## BRAND SUGGESTIONS

| Name | Slogan |
|------|--------|
| **TipidTips.ph** | "Mag-ipon tayo, isa-isang tip." |
| **PisoSaver** | "Bawat piso, mahalaga." |
| **TipidMo** | "Ang tipid, nakakamiss. Ang gastos, nakakainis." |
| **DiskwentoPH** | "Tips para sa tunay na Pilipino." |

> Recommended: **TipidTips.ph** — most searchable, exact keyword match.

---

## SAMPLE TIPS (10 AI-Generated Examples)

1. **[RAIN]** "Tipid Tip: Magbaon na ngayon! Malakas ang ulan bukas — mas mahal ang pamasahe at pagkain sa labas."
2. **[HEAT]** "Init na init? I-set ang aircon sa 25°C lang at gamitin ang electric fan para makatipid ng 30% sa kuryente."
3. **[FUEL]** "Posibleng tumaas ang presyo ng gasolina sa susunod na linggo. Ngayon na mag-refuel kung kaya!"
4. **[PAYDAY]** "Payday na! Bago gumastos, i-set aside muna ang 20% para sa savings. Kahit maliit, malaki ang epekto sa tamang panahon."
5. **[LPG]** "Tumaas na naman ang LPG? Subukan ang rice cooker para sa simple na ulam — mas matipid kaysa sa kalan."
6. **[WEEKEND]** "Weekend grocery tip: pumunta ng umaga (bago mag-10am) para sa mas sariwang pagkain at mas mababang presyo."
7. **[TYPHOON]** "May bagyo na paparating! Bumili na ng 3-day supply ng pagkain at tubig bago pa tumayo ang presyo."
8. **[TRANSPORT]** "Tipid sa Grab: mag-commute sa MRT/LRT muna hanggang malayo, Grab nalang para sa huling parte ng byahe."
9. **[GENERAL]** "Barya na ba ang pera? Huwag mag-ATM sa ibang bangko para maiwasan ang ₱18–₱50 na transaction fee."
10. **[FOOD]** "Mas mura ang pagkain kung luto sa bahay — kahit 3x/week lang magluto, malaki na ang matitipid sa isang buwan."

---

## CURRENT STATUS

- [ ] Phase 0: Project Setup
- [ ] Phase 1: Database Schema
- [ ] Phase 2: Data Collection
- [ ] Phase 3: Rule-Based Analysis
- [ ] Phase 4: Predictions
- [ ] Phase 5: Content Generation
- [ ] Phase 6: Automation
- [ ] Phase 7: Backend API
- [ ] Phase 8: Frontend
- [ ] Phase 9: SEO
- [ ] Phase 10: Google Ads
- [ ] Phase 11: Social/Viral
- [ ] Phase 12: Scale

---

> Start with Phase 0 → Phase 3. Get the rule-based engine working first before adding AI.
