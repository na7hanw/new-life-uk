# Contributing to New Life UK

Thank you for helping refugees and asylum seekers navigate life in the UK.

## Ways to contribute

- **Fix a broken link** — open an issue or edit the data file directly
- **Update outdated content** — GOV.UK policies change; PRs welcome
- **Add a missing guide** — see `nluk/src/data/guides.js`
- **Add a translation** — content objects support 12 languages (see existing entries)
- **Report a bug** — use the Bug Report issue template

## Making changes

1. Fork the repo and create a branch from `main`
2. Edit files in `nluk/src/data/` for content changes
3. Run `npm test` in `nluk/` to validate schemas pass
4. Open a PR — CI runs automatically (lint, test, build, Lighthouse)

## Content files

| File | What it controls |
|------|-----------------|
| `nluk/src/data/guides.js` | All 26 step-by-step guides |
| `nluk/src/data/jobs.js` | Jobs, certs, and career paths |
| `nluk/src/data/emergency.js` | SOS emergency numbers |

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
