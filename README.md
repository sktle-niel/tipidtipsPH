# TipidTips.ph 🇵🇭

Money-saving tips web app para sa mga Pinoy. **Location-aware** at **cost-level-aware**
ang content — pipili ka ng rehiyon mo, tapos personalized na tips at predictions
(fuel / weather / food / electricity / transport) ang ipapakita base sa lugar at
cost of living mo. May food-vlog discovery (sulit eats), saved tips, at email
subscription.

## Tech stack

| Layer        | Tech                                                        |
|--------------|-------------------------------------------------------------|
| Frontend     | React 19 + TypeScript + Vite 8 + Tailwind v4                |
| Routing      | React Router v7                                             |
| Auth + DB    | Firebase (Auth + Firestore)                                 |
| AI content   | Groq (Llama 3.3) → Gemini fallback; Anthropic/Brave (vlogs) |
| Automation   | GitHub Actions cron — daily tip refresh                     |

## Paano gumagana ang content

Walang runtime na AI cost — **pre-baked** lahat ng content at build time:

```
GitHub Actions (araw-araw 6AM PHT)
  └─ scripts/generateLocationTips.ts  → tumawag sa Groq / Gemini AI
       └─ sumulat sa src/data/locationTipsCache.json + locationPredictionsCache.json
            └─ i-commit sa repo (with [skip ci])
                 └─ host auto-deploy
                      └─ React app nag-import ng JSON at build time
                           └─ hooks → i-filter by region + costLevel
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. I-setup ang env vars
cp .env.example .env.local
#    → punan ang VITE_FIREBASE_* (galing Firebase console)
#    → maglagay ng GROQ_API_KEY o GEMINI_API_KEY para sa AI generation

# 3. Run dev server
npm run dev
```

### Firebase

1. Gumawa ng project sa [Firebase console](https://console.firebase.google.com).
2. Add web app → kopyahin ang config sa `.env.local`.
3. **Authentication** → Sign-in method → i-enable ang Google at Facebook.
4. **Firestore** → gumawa ng database, tapos i-deploy ang security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   Tingnan ang [`firestore.rules`](./firestore.rules) — sariling document lang ang
   makikita/ma-edit ng bawat user, at hindi ma-enumerate ang subscriber emails.

## Scripts

| Command                 | Ginagawa                                                       |
|-------------------------|----------------------------------------------------------------|
| `npm run dev`           | Vite dev server                                                |
| `npm run build`         | Type-check + build (may AI prebuild hook)                      |
| `npm run lint`          | ESLint                                                         |
| `npm run generate-tips` | I-regenerate ang location tips + predictions cache             |
| `npm run enrich-vlogs`  | Hanapin ang totoong vlog URLs (kailangan ng GEMINI_API_KEY)    |

> **Note:** Ang `npm run build` ay may `prebuild` hook na tumatakbo ang AI scripts.
> Kung walang API key, gracefully ni-skip — hindi nag-fa-fail ang build.

## CI/CD

- **`.github/workflows/ci.yml`** — type-check + build sa bawat push/PR papuntang
  `main`/`development`. Blocking ang type-check at build; non-blocking pa ang lint.
- **`.github/workflows/daily-tips.yml`** — cron (6AM PHT) na nagre-refresh ng tips
  cache at nagko-commit pabalik sa repo (with `[skip ci]`).

## Deployment (Vercel)

I-connect ang GitHub repo sa [Vercel](https://vercel.com) — auto-detected ang
Vite, walang config na kailangan. Bawat push sa `main` ay nagti-trigger ng build
+ deploy, kasama ang daily tips refresh commit. SPA routing (deep links tulad ng
`/tips`, `/predictions`) ay hino-handle ng [`vercel.json`](./vercel.json).

### Vercel environment variables

Project → Settings → Environment Variables — idagdag ang Firebase config:

| Variable | Galing |
|----------|--------|
| `VITE_FIREBASE_API_KEY` … `VITE_FIREBASE_APP_ID` (6 vars) | Pareho ng nasa `.env.local` |

> ⚠️ **Huwag** ilagay ang `GROQ_API_KEY` / `GEMINI_API_KEY` sa Vercel — para hindi
> tumakbo ang AI generation sa bawat deploy. Ang committed na cache ang ginagamit;
> ang daily cron lang ang gumagawa ng bagong tips.

### Daily tips refresh (GitHub secret)

Repo → Settings → Secrets and variables → Actions → idagdag ang `GROQ_API_KEY`.
Ang `daily-tips.yml` cron ang nagre-regenerate ng tips, nagko-commit pabalik sa
`main`, at ang push na 'yon ang nagti-trigger ng bagong Vercel deploy.

## Project structure

```
src/
  components/   Reusable UI (cards, navbar, modals, banners)
  pages/        Route-level screens
  sections/     Homepage sections (hero, categories, feed, ...)
  hooks/        Data hooks (usePersonalizedTips, usePredictions, useSavedTips)
  services/     Firebase access (user profile, subscribe)
  context/      Auth + UserProfile providers
  data/         Static data + AI-generated JSON caches
  types/        Shared TypeScript types
scripts/        AI content generators (run sa build + cron)
```
