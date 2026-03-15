# New Life UK

A free, multilingual PWA that helps refugees and asylum seekers navigate life in the UK — from registering with a GP to finding work, emergency contacts, and legal rights.

[![CI](https://github.com/na7hanw/new-life-uk/actions/workflows/ci.yml/badge.svg)](https://github.com/na7hanw/new-life-uk/actions/workflows/ci.yml)
[![Security Audit](https://github.com/na7hanw/new-life-uk/actions/workflows/security-audit.yml/badge.svg)](https://github.com/na7hanw/new-life-uk/actions/workflows/security-audit.yml)
[![CodeQL](https://github.com/na7hanw/new-life-uk/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/na7hanw/new-life-uk/actions/workflows/codeql-analysis.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/na7hanw/new-life-uk/badge)](https://securityscorecards.dev/viewer/?uri=github.com/na7hanw/new-life-uk)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://new-life-uk.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- **26 step-by-step guides** — healthcare, housing, education, benefits, employment, legal rights
- **12 languages** — English, Arabic, Farsi, Urdu, Amharic, Tigrinya, Somali, Oromo, Ukrainian, Romanian, Polish, French
- **SOS emergency screen** — one tap to see emergency numbers
- **Jobs & careers** — refugee-friendly employers, certifications, right-to-work guidance
- **Offline-ready PWA** — works without internet after first load
- **Zero tracking** — no analytics, no cookies, no accounts, no data collection

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Routing | HashRouter (works on any CDN) |
| PWA | vite-plugin-pwa + Workbox |
| Styling | CSS modules |
| Testing | Vitest |
| Deploy | Cloudflare Pages (CDN, HTTPS, CSP headers) |
| CI | GitHub Actions |

## Getting started

```bash
cd nluk
npm install
npm run dev        # http://localhost:5173
npm test           # content integrity + schema validation
npm run build      # production build → nluk/dist/
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — content edits (broken links, new guides, translations) are especially welcome.

## Content files

| File | What it controls |
|------|----------------|
| `nluk/src/data/guides.js` | 26 step-by-step guides |
| `nluk/src/data/jobs.js` | Jobs, certifications, career paths |
| `nluk/src/data/emergency.js` | SOS emergency numbers |

## Automations

All automations are **free** and designed to catch bugs early, reduce manual work, and keep dependencies secure.

**See [AUTOMATIONS.md](.github/AUTOMATIONS.md) for full setup instructions** (Sentry, Snyk, GitLocalize, Mergify, Husky).

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI | push / PR | Lint, test, build, security audit |
| Lighthouse | push / PR | Performance & accessibility scores |
| CodeQL | push / PR / weekly | Static security analysis |
| Security Audit | push / PR / weekly | `npm audit` full report |
| Snyk | push / PR / daily | Dependency vulnerability scanning |
| i18n Check | push / PR (guides.js) | All guides have English content |
| Bundle Size | PR | Fail if JS bundle grows > budget |
| Link Health | daily | Opens issue if any URL returns 404 |
| OSSF Scorecard | push / weekly | Supply-chain security score |
| Release Drafter | push to main | Auto-generates changelog |
| Stale Bot | daily | Closes inactive issues/PRs |
| Dependabot | weekly | Keeps dependencies up to date |
| **Sentry** | **production** | **Runtime error monitoring** |
| **Mergify** | **auto** | **Auto-merges safe Dependabot PRs** |
| **Husky** | **pre-commit** | **Local linting before commit** |
| **GitLocalize** | **manual** | **Volunteer translation management** |

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability reporting process.

This app is fully static (no server, no database, no accounts). The attack surface is minimal by design.

## Licence

MIT — see [LICENSE](LICENSE).
