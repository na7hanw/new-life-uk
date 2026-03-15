# GitHub Automations & Integrations

This project uses multiple free GitHub integrations to catch bugs early, reduce manual work, and improve code quality.

## Installed Automations

### CI/CD Pipelines (Auto-run on every push/PR)
- **CI** (`ci.yml`) — Lint, test, build, security audit
- **Lighthouse** (`lighthouse.yml`) — Performance & accessibility scores
- **CodeQL** (`codeql-analysis.yml`) — Static security analysis
- **i18n Check** (`i18n-check.yml`) — Verify all guides have English content
- **Bundle Size Guard** (`bundle-size.yml`) — Fail if JS exceeds budget
- **Cloudflare Pages** — PR preview deployments are created automatically by the Cloudflare Pages Git integration (no workflow required)

### Scheduled Checks (Daily/Weekly)
- **Link Health** (`link-health.yml`) — Auto-opens issue if any URL is 404
- **Security Audit** (`security-audit.yml`) — Full npm audit report (daily + weekly)
- **OSSF Scorecard** (`scorecard.yml`) — Supply-chain security score
- **Stale Bot** (`stale.yml`) — Auto-closes inactive issues/PRs
- **Release Drafter** (`release-drafter.yml`) — Auto-generates changelog

### Dependency Management
- **Dependabot** (`dependabot.yml`) — Auto-opens PRs for outdated packages
- **Mergify** (`.mergify.yml`) — Auto-merges safe PRs (patch/minor Dependabot updates)
- **Snyk** (`snyk-scan.yml`) — Dependency vulnerability scanning (requires token)

### Code Quality
- **Husky + lint-staged** — Pre-commit hooks (runs ESLint locally before committing)
- **Auto-labeler** (`labeler.yml`) — Auto-labels PRs (content, ui, ci, etc.)

### Translation Management
- **GitLocalize** (`.gitlocalize`) — Allow volunteers to contribute translations via UI (requires signup)

### Error Monitoring (Production)
- **Sentry** — Runtime error tracking in deployed app (requires DSN environment variable)

---

## Setup Instructions

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

**Why:** Automatically catch JavaScript errors in production **before** users report them. Includes session replay and performance monitoring.

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

### 3. GitLocalize (Community Translation Management)

**Why:** Allows non-technical translators to contribute translations via web UI instead of editing code.

**Setup:**
```bash
# 1. Go to https://gitlocalize.com and sign up
# 2. Connect your GitHub repo
# 3. GitLocalize will auto-detect files in .gitlocalize config
# 4. Invite translators to help
# 5. When translations are done, GitLocalize auto-opens PRs
```

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
