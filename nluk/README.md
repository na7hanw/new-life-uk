# New Life UK — Deployment & Content Guide

## What this is
A professional, multilingual survival guide PWA for new arrivals in the UK.
**55+ step-by-step guides** across asylum, money, housing, work, health, and legal topics.
12 supported languages with **full auto-translation** via MyMemory API (cached offline).
No account. No tracking. No cost. Ever.

---

## Feature Overview

| Feature | Detail |
|---------|--------|
| **Guides** | 55+ guides: asylum process, Universal Credit, bank accounts, credit score, social housing, investing, UK rules, and more |
| **Resources tab** | Apps, Free Stuff (SAVES), and Hidden Gems (GEMS) — all auto-translated |
| **Work tab** | Jobs with apply links, Certifications (CSCS, SIA, ACCA…), Career paths |
| **UK Life tab** | Survival hacks, money tricks, professional networking — replaces old "Culture" tab |
| **Me / Profile tab** | Status picker, Next Steps per status, progress checklist, saved guides, settings |
| **Languages** | English, Arabic, Farsi, Urdu, Amharic, Tigrinya, Somali, Oromo, Ukrainian, Romanian, Polish, French |
| **Auto-translation** | All guide content, resource cards, culture tips, and UI auto-translate via MyMemory API |
| **Offline** | Full PWA — service worker caches all content; works without internet after first load |
| **Dark mode** | Full dark/light theme with system preference detection |
| **Accessibility** | Semantic HTML, ARIA labels, keyboard navigation, RTL support, screen reader announcements |
| **Privacy** | Zero data collection. All preferences stored in localStorage only. GDPR compliant. |

---

## Quick Start (15 minutes, £0)

### Step 1: Install Node.js
Go to https://nodejs.org, download the LTS version, install it.

### Step 2: Open terminal and navigate to the project
```bash
cd path/to/new-life-uk/nluk
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Test locally
```bash
npm run dev
```
Open the URL shown (usually http://localhost:5173) in your browser.

### Step 5: Build for production
```bash
npm run build
```
This creates a `dist/` folder ready for deployment.

### Step 6: Deploy to Cloudflare Pages (free)
1. Go to https://pages.cloudflare.com
2. Sign up / log in → Create a project → Connect to Git
3. Select this repository and set:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `nluk`
4. Click "Save and Deploy" — your site is live at **new-life-uk.pages.dev**

---

## How to Update Content

All content is in TypeScript data files in `src/data/`. Edit the file, save, run `npm run build`, push to GitHub — Cloudflare Pages redeploys automatically.

| File | What it controls |
|------|----------------|
| `src/data/guides.ts` | 55+ step-by-step guides + GUIDE_PRIORITY, GUIDE_KEYWORDS, GUIDE_RELATED, GUIDE_SOURCE_URL, GUIDE_LAST_UPDATED |
| `src/data/jobs.ts` | Jobs (with apply links), Certifications, Career paths |
| `src/data/emergency.ts` | SOS numbers (999, 101) and helplines |
| `src/data/saves.ts` | Free resources (SAVES) and Hidden Gems (GEMS) |
| `src/data/apps.ts` | Essential apps organised by category |
| `src/data/culture.ts` | UK Life & Hacks sections (all auto-translated) |
| `src/data/ui-strings.ts` | UI strings for all 12 languages |

### Adding a new guide
Every guide must have:
```ts
{
  id: "unique-id",           // kebab-case, used in URL /guide/unique-id
  cat: "Money",              // Must match a key in CATEGORIES
  icon: "💷",
  content: {
    en: {
      title: "Guide Title",
      summary: "One sentence summary.",
      steps: ["Step 1…", "Step 2…"]
    }
    // Other language keys auto-translate via MyMemory if not provided
  },
  cost: "Free",              // optional
  time: "Same day",          // optional
  bring: ["Passport"],       // optional
  links: [{ name: "GOV.UK", url: "https://…" }]  // optional
}
```
Then register it in all 4 lookup objects at the bottom of `guides.ts`:
- `GUIDE_PRIORITY` — display order
- `GUIDE_KEYWORDS` — fuzzy search aliases
- `GUIDE_SOURCE_URL` — official source link for footer
- `GUIDE_LAST_UPDATED` — verified date for footer
- `GUIDE_RELATED` — related guides for cross-linking

### Adding a translation for a guide
```ts
content: {
  en: { title: "Bank Account", summary: "…", steps: ["…"] },
  am: { title: "የባንክ ሒሳብ", summary: "…", steps: ["…"] },
  ar: { title: "حساب بنكي", summary: "…", steps: ["…"] },
}
```
If a language key is missing, the app auto-translates via MyMemory API and caches the result in the user's browser.

---

## Architecture

- **Framework**: React 18 + Vite 6, TypeScript
- **Routing**: React Router DOM v7 (HashRouter)
- **Styling**: CSS Modules + CSS custom properties (design tokens)
- **State**: React Context (AppContext) — lang, dark, userStatus, bookmarks
- **Translation**: MyMemory API (free, 100+ languages) + FNV-1a hashed localStorage cache
- **Search**: Fuse.js fuzzy search with keyword aliases
- **PWA**: vite-plugin-pwa — full service worker, offline-first, installable
- **Hosting**: Cloudflare Pages (free tier, global CDN, custom domain, HTTPS)
- **Validation**: Zod schemas for all data types

## File Structure
```
src/
├── App.tsx               ← Shell: tabs, routing, header, SOS modal
├── context/
│   └── AppContext.tsx    ← Global state: lang, dark, userStatus, bookmarks
├── data/
│   ├── guides.ts         ← 55+ guides + 5 lookup maps
│   ├── jobs.ts           ← Jobs, certs, career paths
│   ├── saves.ts          ← SAVES (free stuff) + GEMS (hidden gems)
│   ├── apps.ts           ← Essential apps by category
│   ├── culture.ts        ← UK Life & Hacks sections
│   ├── emergency.ts      ← Emergency numbers and helplines
│   └── ui-strings.ts     ← UI strings for all 12 languages
├── lib/
│   ├── translate.ts      ← MyMemory API + localStorage cache
│   ├── useTranslation.ts ← useTranslatedContent, useTranslatedSteps hooks
│   ├── schema.ts         ← Zod validation schemas
│   └── utils.ts          ← t18() i18n helper, ls/lsSet localStorage utils
├── pages/
│   ├── GuidesPage.tsx    ← Main guides tab with hero, search, For You, categories
│   ├── GuideDetail.tsx   ← Individual guide with auto-translate + Related Guides
│   ├── WorkHub.tsx       ← Jobs / Certs / Careers tabs
│   ├── SavesPage.tsx     ← Apps / Free / Gems tabs
│   ├── CulturePage.tsx   ← UK Life & Hacks with auto-translated sections
│   ├── ProfilePage.tsx   ← Me tab: status, next steps, checklist, bookmarks
│   └── MorePage.tsx      ← Settings: language, theme, privacy
└── components/
    ├── ResourceCard.tsx  ← Auto-translating card for apps/saves/gems
    ├── CultureCard.tsx   ← Auto-translating collapsible culture tip card
    ├── ChecklistWidget.tsx ← Progress checklist (localStorage)
    ├── StepText.tsx      ← Markdown-bold renderer for guide steps
    └── …
```

---

## Privacy Policy

**New Life UK — Privacy Policy**
Last updated: March 2026

New Life UK does not collect, store, or share any personal data.
No account is required. No analytics. No tracking. No cookies.
Language, theme, status, and bookmarks are saved on your device only.
Anonymous crash reports (opt-in only) sent to Sentry — no personal information included.
External links go to gov.uk, nhs.uk, and other official sites.

---

## Custom Domain (Optional, £0–£10/year)
1. Buy a domain (e.g., newlifeuk.org) for ~£8–10/year
2. In Cloudflare Pages: Settings → Custom domains → Set up a custom domain
3. Follow Cloudflare's instructions to point your domain
4. Cloudflare provides free HTTPS automatically
