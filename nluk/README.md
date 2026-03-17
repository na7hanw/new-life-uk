# New Life UK v2 — Deployment Guide

## What this is
A professional, multilingual survival guide website for new arrivals in the UK.
26 guides, 16 free stuff items, 15 hidden gems, 12 languages, social sharing, dark/light mode.

## Quick Start (15 minutes, £0)

### Step 1: Install Node.js
1. Go to https://nodejs.org
2. Download the LTS version (big green button)
3. Install it (click Next on everything)

### Step 2: Open your computer's terminal
- **Windows**: Press Windows key, type "cmd", press Enter
- **Mac**: Press Cmd+Space, type "terminal", press Enter

### Step 3: Go to the project folder
```
cd path/to/new-life-uk
```

### Step 4: Install dependencies
```
npm install
```
Wait 30 seconds for it to finish.

### Step 5: Test locally
```
npm run dev
```
Open the URL shown (usually http://localhost:5173) in your browser.
Press Ctrl+C when done.

### Step 6: Build for production
```
npm run build
```
This creates a `dist` folder.

### Step 7: Deploy to Cloudflare Pages (free)
1. Go to https://pages.cloudflare.com
2. Sign up or log in with your Cloudflare account
3. Click "Create a project" → "Connect to Git"
4. Select this repository
5. Set the build configuration:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `nluk`
6. Click "Save and Deploy" — your site is live!
7. Your site is now at: **new-life-uk.pages.dev**

## Done. Share the link everywhere.

---

## How to Update Content

Content is split across dedicated TypeScript files in `src/data/`:

| File | What it controls |
|------|----------------|
| `src/data/guides.ts` | 26 step-by-step guides |
| `src/data/jobs.ts` | Jobs, certifications, career paths |
| `src/data/emergency.ts` | SOS emergency numbers |
| `src/data/saves.ts` | Free resources and hidden gems |
| `src/data/apps.ts` | Essential apps for new arrivals |
| `src/data/culture.ts` | Culture tips and information |
| `src/data/ui-strings.ts` | UI strings and language configuration |
| `src/data/content.ts` | Barrel re-export of all data files (backward compat) |

### To edit a guide:
1. Open `src/data/guides.ts` in any text editor
2. Find the guide by searching for its title
3. Edit the text
4. Save the file
5. Run `npm run build`
6. Push changes to GitHub — Cloudflare Pages will redeploy automatically

### To add a translation for a guide:
Each guide has this structure:
```js
content: {
  en: { title: "...", summary: "...", steps: [...] },
  // Add a new language like this:
  ar: { title: "...", summary: "...", steps: [...] },
}
```
Just add a new language key with the translated content.

### To fix a broken link:
Search for the old URL in the relevant file (e.g. `guides.ts`, `saves.ts`, `jobs.ts`), replace it with the new one.

---

## Custom Domain (Optional, £0-£10/year)
1. Buy a domain (e.g., newlifeuk.org) for about £8-10/year
2. In Cloudflare Pages: Settings → Custom domains → Set up a custom domain
3. Follow Cloudflare's instructions to point your domain
4. Cloudflare provides free HTTPS automatically

---

## Privacy Policy (host as a page on your site)

**New Life UK — Privacy Policy**
Last updated: March 2026

New Life UK does not collect, store, or share any personal data.
No account is required. No analytics. No tracking. No cookies.
Language, theme, and status preferences are saved on your device only.
External links go to gov.uk, nhs.uk, and other official sites.

---

## Architecture Notes

- **Framework**: React 18 + Vite (fast, modern, zero-config)
- **Hosting**: Cloudflare Pages (free tier, global CDN, custom domain, HTTPS)
- **PWA**: Optional install-to-homescreen via vite-plugin-pwa
- **Data**: i18n-ready structure split across `src/data/` TypeScript files
- **Styling**: CSS variables for theme, responsive typography
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Sharing**: WhatsApp, Telegram, Facebook, copy-link on every guide
- **Offline**: Service worker caches all content for offline use
- **Performance**: All content hardcoded (no API calls), Vite tree-shakes unused code

## File Structure
```
src/
├── main.tsx          ← Entry point + error boundary
├── App.tsx           ← Main app with routing
├── index.css         ← All styles (CSS variables)
└── data/
    ├── guides.ts     ← 26 step-by-step guides
    ├── jobs.ts       ← Jobs, certifications, career paths
    ├── emergency.ts  ← SOS emergency numbers
    ├── saves.ts      ← Free resources and hidden gems
    ├── apps.ts       ← Essential apps for new arrivals
    ├── culture.ts    ← Culture tips and information
    ├── ui-strings.ts ← UI strings and language config
    └── content.ts    ← Barrel re-export (backward compat)
```
