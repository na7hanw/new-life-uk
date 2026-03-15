# Security Policy

## Supported Versions

New Life UK is a static PWA with no server-side code. The latest version on `main` is always the supported version.

## Reporting a Vulnerability

**Please do not report security vulnerabilities via public GitHub issues.**

Email **hello@newlifeuk.org** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will respond within 48 hours and aim to release a fix within 7 days for high-severity issues.

## Security Design

This app is designed with a minimal attack surface:
- **No backend / no server** — fully static, deployed to Cloudflare Pages CDN
- **No user accounts** — no authentication, no sessions
- **No data collection** — localStorage only (language + theme preference)
- **No external API calls** — all content is bundled at build time
- **Strict CSP** — `script-src 'self'`, `connect-src 'self'`, `frame-src 'none'`
- **No cookies** — nothing to steal
- **HTTPS only** — enforced by Cloudflare
