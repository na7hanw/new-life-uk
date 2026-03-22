# CI / Automation Overview

This project uses multiple free GitHub integrations to catch bugs early, reduce manual work, and keep dependencies secure.  Everything listed here is $0 — see the [Cost Breakdown](#cost-breakdown) at the bottom.

---

## Workflow map

### Required checks (block merge on failure)

| Workflow | File | Trigger | What it does |
|----------|------|---------|--------------|
| **CI** | `ci.yml` | push / PR → `main` | Lint (ESLint + a11y), TypeScript type-check, Vitest tests, production build, `npm audit --audit-level=high` |
| **CodeQL** | `codeql-analysis.yml` | push / PR → `main`, weekly Mon | Static security analysis of JavaScript/TypeScript |
| **Security Audit** | `security-audit.yml` | push / PR → `main`, weekly Mon | Full `npm audit` report + fail on high/critical CVEs |
| **i18n Check** | `i18n-check.yml` | push / PR → `main` (guides.ts only) | Verifies every guide has complete English content |
| **Broken Link Check** | `broken-links.yml` | push / PR → `main` | Lychee link-checker on all `*.md` files |

> **Note — security audit overlap:** Both `ci.yml` and `security-audit.yml` run `npm audit --audit-level=high` on push/PR.  
> The duplication is intentional: `ci.yml` keeps the gate in the main pipeline; `security-audit.yml` additionally runs on a weekly schedule and prints the full verbose report for triage.

### Informational / non-blocking checks (post results, do not block merge)

| Workflow | File | Trigger | What it does |
|----------|------|---------|--------------|
| **Bundle Size** | `bundle-size.yml` | PR → `main` | Runs `size-limit` and posts a bundle-size comparison comment on the PR |
| **Lighthouse** | `lighthouse.yml` | push / PR → `main` | Performance, accessibility, SEO, and PWA scores via Lighthouse CI |
| **Snyk** | `snyk-scan.yml` | push / PR → `main`, daily 09:00 UTC | Dependency vulnerability scan; uploads SARIF to GitHub Security tab |
| **PR Size Guard** | `pr-size-guard.yml` | PR opened/updated | Posts a comment warning if PR exceeds 400 lines or 25 files changed |

> These workflows post comments or upload results but do **not** fail the PR.

### Scheduled checks (run without a PR)

| Workflow | File | Schedule | What it does |
|----------|------|---------|--------------|
| **Data Link Health** | `link-health.yml` | Daily 07:00 UTC | Curls every `https://` URL in all data files; opens a GitHub issue with **URL + file:line** for any 404/410 found; closes the previous issue before opening a new one (no spam) |
| **OSSF Scorecard** | `scorecard.yml` | push to `main`, weekly Mon | Supply-chain security score; results appear in the Security tab |
| **Stale Bot** | `stale.yml` | Daily 01:00 UTC | Marks issues stale after 60 days, PRs after 30 days; closes after 14 more days |

### Automation / housekeeping

| Workflow / Tool | File | Trigger | What it does |
|-----------------|------|---------|--------------|
| **Release Drafter** | `release-drafter.yml` | push to `main` | Maintains a rolling draft release / changelog |
| **Auto-labeler** | `labeler.yml` | PR opened/updated | Labels PRs by changed paths (content, ui, ci…) and adds size labels (XS → XL) |
| **Dependabot Auto-merge** | `dependabot-auto-merge.yml` | PR from dependabot[bot] | Auto-merges patch/minor dependency updates once CI passes |
| **Auto-translate** | `auto-translate.yml` | push to `main` (guides.ts), manual dispatch | Fills missing translations using **LibreTranslate/Argos** (free, no key) and optionally a **self-hosted NLLB-200** endpoint for low-resource languages (am, ti, so, om, ur); opens a PR. **No Google Cloud Translation, no MyMemory, no paid APIs.** |
| **Sentry Setup** | `sentry-setup.yml` | manual dispatch, monthly | One-time helper that prints Sentry project setup instructions |

### External integrations (no workflow file)

| Integration | Config | What it does |
|-------------|--------|--------------|
| **Cloudflare Pages** | (Git integration) | Deploys `nluk/dist` on push to `main`; PR preview deployments created automatically |
| **Dependabot** | `.github/dependabot.yml` | Opens weekly PRs for outdated npm packages |
| **Mergify** | `.mergify.yml` | Auto-merges patch/minor Dependabot PRs when CI passes; also mirrors the `dependabot-auto-merge.yml` logic |
| **Husky + lint-staged** | `nluk/package.json`, `.husky/` | Pre-commit hook runs ESLint on staged files locally |
| **GitLocalize** | `.gitlocalize` | ⚠️ Legacy config — kept for reference only. All translations now use the automated open-source pipeline (LibreTranslate / NLLB). Human volunteer translation is welcome via standard PRs but is not a workflow dependency. |
| **Sentry** | `nluk/src/lib/sentry.ts` | Runtime error tracking in production (requires `VITE_SENTRY_DSN` env var) |

---

## Consolidation decisions

### Bundle-size: one workflow kept, one removed

Two bundle-size workflows existed previously:

| File | Status | Reason |
|------|--------|--------|
| `bundle-size.yml` | ✅ **Active** | Uses `andresz1/size-limit-action`; runs on PR; posts a size-comparison comment; respects `nluk/.size-limit.json` |
| `size-limit.yml` | 🗑️ **Removed** | Used a globally-installed `size-limit` CLI with no config; used the unmaintained `actions/checkout@v2`; had a broken output condition; ran on `push` to `main` (not PR); was never posting useful output |

### Link-health: enhanced, not replaced

`link-health.yml` (curl-based, daily, data files) and `broken-links.yml` (Lychee, PR gate, markdown + TypeScript data files) are kept as **separate** workflows because they serve different purposes:

- `broken-links.yml` — fast PR gate; validates hyperlinks in documentation and all TypeScript data files
- `link-health.yml` — daily maintenance; validates live URLs embedded in app data (jobs, guides, saves, apps, culture, emergency, immigration-updates)

`link-health.yml` and `broken-links.yml` were both updated to scan **seven** data files:
1. `guides.ts` — 26 step-by-step guides
2. `saves.ts` — free resources and hidden gems
3. `apps.ts` — essential apps
4. `jobs.ts` — job listings and career resources
5. `culture.ts` — culture tips
6. `emergency.ts` — SOS emergency numbers
7. `immigration-updates.ts` — official policy change feed *(added March 2026)*

Additional improvements to `link-health.yml`:
- Include **file and line number** in the issue body so developers can jump directly to the broken reference
- Replace the previous issue before opening a new one (anti-spam — at most one open `broken-links` issue at any time)

---

## External APIs

These are the external services the app calls at runtime. All degrade gracefully when not configured.

| API | Env var | Required | Used for | Fallback |
|-----|---------|----------|---------|---------|
| [Postcodes.io](https://postcodes.io) | — | No | Postcode → NHS area / constituency | Shows "Postcode not found" |
| [Companies House](https://developer.company-information.service.gov.uk/) | `VITE_CH_API_KEY` | For in-app search | Employer verification (anti-scam) | Shows link to public CH website |
| [LibreTranslate / Argos](https://libretranslate.com) | `VITE_LIBRE_ENDPOINT` | No | Auto-translation pipeline | Falls back to Bergamot (browser) |
| [NLLB-200](https://ai.meta.com/research/no-language-left-behind/) | `VITE_NLLB_ENDPOINT` | No | Low-resource languages (am, ti, so, om) | Falls back to LibreTranslate |
| [MediaWiki REST API](https://en.wikipedia.org/api/rest_v1) | — | No | Glossary term popups in guide steps | Silently omitted |
| [Sentry](https://sentry.io) | `VITE_SENTRY_DSN` | No | Production error monitoring | App works without it |

> **No MyMemory, no Google Cloud Translation, no paid translation APIs.** All translation uses LibreTranslate/Argos (open-source, self-hostable) with optional NLLB-200 for Amharic, Tigrinya, Somali, and Oromo.

---

## Setup Instructions

### 0. Companies House API Key (for employer verification)

**Why:** Enables the in-app "Verify Employer" search in WorkHub. Without it the component shows a link to the public Companies House website (still functional, just not embedded).

**Setup:**
```bash
# 1. Register at https://developer.company-information.service.gov.uk/
# 2. Create an application (free)
# 3. Copy your API key
# 4. Add to Cloudflare Pages environment variables:
#    - Pages project → Settings → Environment variables
#    - Name: VITE_CH_API_KEY
#    - Value: (paste your key)
#    - Scope: Production (and optionally Preview)
# Rate limit: 600 requests / 5 minutes (free tier, no usage cost)
```

### 1. Snyk (Dependency Vulnerability Scanning)

**Why:** Finds vulnerabilities that Dependabot might miss. Complements `npm audit`.

**Setup:**
```bash
# 1. Sign up at https://snyk.io (free tier)
# 2. Connect your GitHub repo
# 3. Get your Snyk API token from Settings
# 4. Add to GitHub Secrets:
#    - Settings → Secrets and variables → New repository secret
#    - Name: SNYK_TOKEN
#    - Value: (paste your token)
```

### 2. Sentry (Production Error Monitoring)

**Why:** Automatically catch JavaScript errors in production **before** users report them. Includes anonymised error reporting and performance monitoring.

> **Privacy note:** Session replay is intentionally **disabled** in this app. This app serves refugees and asylum seekers — session recording would be too privacy-invasive. The Sentry integration strips all PII (IP, user-agent, device fingerprint, cookies, navigation URLs) before any data leaves the browser. See `nluk/src/lib/sentry.ts` for the `beforeSend` filter.

**Setup:**
```bash
# 1. Sign up at https://sentry.io (free tier: 5k errors/month)
# 2. Create an organization (or use default)
# 3. Create a new project:
#    - Platform: React
#    - Name: "New Life UK"
#    - Alerts: Default (or customize)
# 4. Copy your DSN (looks like: https://xxx@xxx.ingest.sentry.io/12345)
# 5. Add to GitHub Secrets:
#    - Name: SENTRY_DSN
#    - Value: (paste your DSN)
# 6. Add the DSN as an environment variable in the Cloudflare Pages dashboard:
#    - Pages project → Settings → Environment variables → Add variable
#    - Name: VITE_SENTRY_DSN
#    - Value: (paste your DSN)
#    - Scope: Production (and optionally Preview)
# 7. Redeploy (or push a new commit to trigger build)
# 8. Test: Visit the deployed app, open DevTools console, and type:
#    Sentry.captureException(new Error("Test error"))
```

**What you'll get:**
- Real-time alerts when errors occur in production
- Stack traces with source maps
- Session replay (see exactly what user was doing)
- Performance monitoring
- Geographic + browser breakdown

### 3. GitLocalize (Legacy — not a workflow dependency)

**Status:** The `.gitlocalize` config file is retained for reference. The app no longer depends on volunteer human translation. All missing translations are filled automatically by the `auto-translate` workflow using LibreTranslate/Argos (free, open-source, no API key) and optionally a self-hosted NLLB-200 endpoint for low-resource languages.

**Translation policy:**
- No Google Cloud Translation, Azure Translator, DeepL, or any paid/commercial API
- No MyMemory
- Provider order: Bergamot (WASM, client-side) → LibreTranslate/Argos → NLLB-200 (self-hosted) → "translation unavailable"
- All translated content shows a visible machine-translation disclaimer
- Legal/financial/official-content pages show a stronger disclaimer

**If you want community translation contributions:** contributors can open a standard PR editing `nluk/src/data/guides.ts` directly. The GitLocalize web UI remains available as a convenience but is not part of the automated pipeline.

### 4. Mergify (Auto-merge Safe PRs)

**Why:** Automatically merges Dependabot PRs if all checks pass, reducing manual review load.

**Status:** Configured in `.mergify.yml`

**How it works:**
- Watches for Dependabot PRs
- If CI passes (Build & Test, Lighthouse), auto-merges with squash
- Deletes head branch automatically
- **Rule:** Doesn't merge breaking/major version bumps (still requires manual review)

### 5. Husky + lint-staged (Pre-commit Hooks)

**Why:** Catches linting errors **before** you commit, preventing broken PRs.

**Status:** Configured in `package.json` + `.husky/pre-commit`

**How it works:**
```bash
# When you try to commit:
git commit -m "fix: broken link"
# → Automatically runs ESLint on changed files
# → If lint fails, commit is blocked (you fix it and try again)
# → If lint passes, commit succeeds
```

**For team members:**
```bash
cd nluk
npm install    # This installs husky hooks
git commit ...  # Pre-commit hooks now active
```

---

## Verification Checklist

### Is everything working?

1. **CI** — Should see green ✅ checkmarks on every PR
2. **Lighthouse** — Should report Perf/Accessibility scores on PRs
3. **Link Health** — Should see issues opened if any URLs are 404
4. **Dependabot** — Should auto-open PRs for outdated packages
5. **Mergify** — Should auto-merge Dependabot patch/minor PRs
6. **Sentry** — Should receive email alerts when errors occur in production
7. **Snyk** — Should report dependency vulnerabilities in PRs

### To test Sentry:
```bash
# In the deployed app's browser console:
Sentry.captureMessage("Test message from New Life UK")
# Or trigger an error:
Sentry.captureException(new Error("Test error"))
```
Check https://sentry.io — you should see the message/error appear immediately.

---

## Cost Breakdown

| Tool | Tier | Cost | Notes |
|------|------|------|-------|
| GitHub Actions | Free | $0 | 2,000 free minutes/month per account |
| Cloudflare Pages | Free | $0 | Unlimited requests, 500 builds/month free |
| Dependabot | Built-in | $0 | GitHub native, always free |
| Mergify | Free | $0 | Free tier covers unlimited repos |
| Husky | Open source | $0 | Local only, no cloud cost |
| GitLocalize | Free | $0 | Free tier for open source |
| Sentry | Developer | $0 | 5,000 errors + 5,000 replays/month free |
| Snyk | Free | $0 | Free for open source repos |

**Total: $0** — Everything is free.

---

## Recommended Next Steps

1. ✅ Already done: Husky, Mergify, lint-staged, GitLocalize config
2. 🔶 Optional: Set up Snyk (quick, adds vulnerability coverage)
3. 🔶 Optional but recommended: Set up Sentry (huge impact on catching production bugs early)
4. 🔶 Optional: Invite translators to GitLocalize
