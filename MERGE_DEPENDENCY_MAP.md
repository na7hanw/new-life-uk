# Merge Dependency Map — New Life UK

> **Release Manager Audit** | Generated: March 2026 | Covers 19 open PRs

---

## 🚦 Merge Train Status

| Stage | Description | Status |
|-------|-------------|--------|
| **Stage 1** | Low-risk / High-impact Infrastructure | ✅ **COMPLETE** — Build passing, 18/18 tests green |
| **Stage 2** | Major Structural Shifts (Cloudflare, TypeScript, UI Redesign) | ⏳ Ready to begin |
| **Stage 3** | Content & Compliance (i18n, GDPR, Sub-tabs, URL fixes) | ⏳ Waiting on Stage 2 |

### Stage 1 Completion Summary (March 2026)
- `LICENSE` created: MIT — Copyright (c) 2026 New Life UK ✅
- PRs #18, #19, #21, #22: GitHub Actions bumped to latest versions ✅
- PR #9: `@sentry/tracing` removed, ESLint React `'19.2'`, `onFID→onINP` ✅
- PR #25: Husky v9 pre-commit + pre-push test gate active ✅
- PR #1: Superseded — Vite 8 uses Rolldown, no esbuild dependency ✅
- `npm run build`: **✅ 339 modules, 0 errors, 0 vulnerabilities**
- `npm test`: **✅ 18/18 tests pass**
- `npm run lint`: **✅ 0 warnings**

---

## Task 1 · Dependency & Conflict Audit

### PR Inventory by Category

#### 🟦 FOUNDATIONAL — Infrastructure & Tooling (merge first)

| PR | Title | Key Files Changed | Risk | Status |
|----|-------|-------------------|------|--------|
| [#1](https://github.com/na7hanw/new-life-uk/pull/1) | bump esbuild 0.21→0.25 | `nluk/package-lock.json` | 🟢 None | ✅ **Superseded** — Vite 8 uses Rolldown (esbuild no longer a direct dep) |
| [#18](https://github.com/na7hanw/new-life-uk/pull/18) | ci: bump release-drafter 6→7 | `.github/workflows/release-drafter.yml` | 🟢 None | ✅ **Merged** (Stage 1) |
| [#19](https://github.com/na7hanw/new-life-uk/pull/19) | ci: bump actions/labeler 5→6 | `.github/workflows/labeler.yml` | 🟢 None | ✅ **Merged** (Stage 1) |
| [#21](https://github.com/na7hanw/new-life-uk/pull/21) | ci: bump lighthouse-ci-action 11→12 | `.github/workflows/lighthouse.yml` | 🟢 None | ✅ **Merged** (Stage 1) |
| [#22](https://github.com/na7hanw/new-life-uk/pull/22) | ci: bump create-pull-request 7→8 | `.github/workflows/auto-translate.yml` | 🟢 None | ✅ **Merged** (Stage 1) |
| [#9](https://github.com/na7hanw/new-life-uk/pull/9) | Fix LICENSE, ESLint React version, deprecated Sentry/web-vitals | `LICENSE`, `nluk/eslint.config.js`, `nluk/package.json`, `nluk/src/main.jsx` | 🟡 Low | ✅ **Merged** (Stage 1) |
| [#25](https://github.com/na7hanw/new-life-uk/pull/25) | Husky v9 syntax + pre-push test gate | `.husky/pre-commit`, `.husky/pre-push`, `nluk/package.json` | 🟡 Low | ✅ **Merged** (Stage 1) |

#### 🟨 STRUCTURAL — Deployment & Architecture shifts

| PR | Title | Key Files Changed | Risk |
|----|-------|-------------------|------|
| [#10](https://github.com/na7hanw/new-life-uk/pull/10) | Migrate Netlify → Cloudflare Pages (basic) | `netlify.toml` (remove), `nluk/public/_headers`, `README.md` | 🟡 Low |
| [#12](https://github.com/na7hanw/new-life-uk/pull/12) | Migrate Netlify → Cloudflare Pages (full) | `.github/AUTOMATIONS.md`, `.github/workflows/cloudflare-preview.yml` (add), `netlify-preview.yml` (remove), `nluk/public/_headers`, `README.md`, `SECURITY.md` | 🟡 Low — supersedes #10 |
| [#28](https://github.com/na7hanw/new-life-uk/pull/28) | TypeScript migration (`.jsx`→`.tsx`, CSS modules, new tests) | `nluk/src/App.tsx` (rename), `nluk/src/context/AppContext.tsx` (rename), `nluk/eslint.config.js`, `nluk/package.json`, all component files | 🔴 **HIGH** — renames every source file |

#### 🟥 FEATURE — Product Behaviour & Content

| PR | Title | Key Files Changed | Risk |
|----|-------|-------------------|------|
| [#11](https://github.com/na7hanw/new-life-uk/pull/11) | i18next, DOMPurify, lazy loading, system fonts, a11y | **`App.jsx`** (+16/-7), **`AppContext.jsx`** (+3), **`index.css`** (+28/-3), `main.jsx`, pages | 🔴 **HIGH** |
| [#14](https://github.com/na7hanw/new-life-uk/pull/14) | Auto-translate (MyMemory API), browser lang detection, PWA install | **`App.jsx`** (+24), **`AppContext.jsx`** (+17/-1), **`index.css`** (+68/-3), `translate.js` (new), pages | 🔴 **HIGH** |
| [#26](https://github.com/na7hanw/new-life-uk/pull/26) | UI Redesign (full rewrite of design system) | **`index.css`** (+232/-203) | 🔴 **EXTREME** — rewrites entire stylesheet |
| [#16](https://github.com/na7hanw/new-life-uk/pull/16) | Restructure Free Stuff sub-tabs + coverage CI | **`App.jsx`** (+16/-12), `data/guides.js` (+81/-64), `data/jobs.js` (+353/-265), `data/saves.js`, `SavesPage.jsx`, `WorkHub.jsx` | 🔴 **HIGH** |
| [#15](https://github.com/na7hanw/new-life-uk/pull/15) | Remove floating SOS button; fix SSP rate | **`App.jsx`** (-10), **`index.css`** (-28), `data/guides.js` | 🟡 Low |
| [#23](https://github.com/na7hanw/new-life-uk/pull/23) | UK GDPR compliance — consent gate, privacy notice, ICO rights | **`App.jsx`** (+4), `data/ui-strings.js`, `MorePage.jsx`, `lib/sentry.js` (new), `ConsentBanner.jsx` (new) | 🟡 Low |

#### 🟩 CONTENT — Data-only fixes

| PR | Title | Key Files Changed | Risk |
|----|-------|-------------------|------|
| [#24](https://github.com/na7hanw/new-life-uk/pull/24) | Fix broken URLs in jobs.js and guides.js | `data/guides.js` (+10/-10), `data/jobs.js` (+26/-26) | 🟢 Low |
| [#27](https://github.com/na7hanw/new-life-uk/pull/27) | [WIP] Fix broken links | No files committed yet | ⚪ Pending |
| [#29](https://github.com/na7hanw/new-life-uk/pull/29) | Fix broken and stale links | `data/guides.js` (+28/-28), `data/jobs.js` (+26/-26) | 🟢 Low |

---

### 🚨 Conflict Heat Map

The following files are **simultaneously modified by multiple PRs**. Any two PRs in the same row will cause a merge conflict.

#### `nluk/src/App.jsx` → **5 PRs touch this file**

| PR | Lines Added | Lines Deleted | What it does |
|----|-------------|---------------|--------------|
| #11 | +16 | -7 | Adds i18next wrapper, lazy imports, DOMPurify |
| #14 | +24 | 0 | Adds auto-translate overlay, PWA install prompt |
| #15 | 0 | -10 | Removes floating SOS button block |
| #16 | +16 | -12 | Restructures SavesPage routing/tabs |
| #23 | +4 | 0 | Inserts `<ConsentBanner>` component |
| #28 | (renames to **App.tsx**) | — | TypeScript types + CSS modules |

> **Verdict:** PRs #11, #14, #15, #16, and #23 will all conflict with each other in `App.jsx`. Any merge order other than strictly sequential (with rebases) will produce 3-way conflicts.

#### `nluk/src/index.css` → **4 PRs touch this file**

| PR | Lines Added | Lines Deleted | What it does |
|----|-------------|---------------|--------------|
| #11 | +28 | -3 | System-font stack, new utility classes |
| #14 | +68 | -3 | Translate overlay, PWA banner styles |
| #15 | 0 | -28 | Removes `.floating-sos` and `@keyframes sosPulse` |
| #26 | +232 | -203 | **Full design-system rewrite (v2→v3)** |

> **Verdict:** PR #26 is a **full rewrite** of `index.css`. It will obliterate all changes from #11, #14, and #15 if merged after them — or conflict violently if merged before them. It must be treated as the **final authority** on styles.

#### `nluk/src/context/AppContext.jsx` → **2 PRs touch this file**

| PR | Lines Added | Lines Deleted | What it does |
|----|-------------|---------------|--------------|
| #11 | +3 | 0 | Adds i18n state |
| #14 | +17 | -1 | Adds auto-translate state & browser lang detection |
| #28 | (renames to **AppContext.tsx**) | — | TypeScript types |

> **Verdict:** PRs #11 and #14 both add state to `AppContext.jsx`. Their changes are adjacent but not identical — manual merge review required.

#### `nluk/src/data/guides.js` + `jobs.js` → **Data race**

| PR | Edits in guides.js | Edits in jobs.js | Purpose |
|----|-------------------|-----------------|---------|
| #15 | +2/-2 (SSP rate) | — | Data fix |
| #16 | +81/-64 | +353/-265 | Content restructure |
| #24 | +10/-10 | +26/-26 | URL fix |
| #29 | +28/-28 | +26/-26 | URL fix |

> **Verdict:** PRs #24 and #29 overlap heavily (same 26 jobs.js URL fixes). Merge only one; close the other as a duplicate.

#### `nluk/package.json` → **3 PRs modify this**

| PR | Change |
|----|--------|
| #9 | Removes deprecated `@sentry/tracing` |
| #25 | Adds `"prepare": "cd .. && husky"` script |
| #28 | Adds TypeScript + testing-library devDependencies |

> **Verdict:** Sequential merges will each cause a small 3-line conflict. Resolve by accepting all three changes together.

---

## Task 2 · The Merge Train Sequence

### Stage 1 — Low-risk / High-impact Infrastructure *(merge in this order)*

1. **PR #1** — esbuild dependency bump (package-lock only, zero conflict risk)
2. **PR #18** — Bump release-drafter action
3. **PR #19** — Bump actions/labeler
4. **PR #21** — Bump lighthouse-ci-action
5. **PR #22** — Bump create-pull-request action
6. **PR #9** — License file + ESLint React 19.2 + remove deprecated `@sentry/tracing` + fix `onFID→onINP`
7. **PR #25** — Husky v9 pre-commit + pre-push test gate

**Why this order prevents Merge Hell:**
- All five Dependabot bumps modify completely different workflow YAML files. They have zero overlap and can be merged in any order — or even all at once via the Dependabot auto-merge workflow.
- PR #9 cleanses `package.json` (removes `@sentry/tracing`) before PRs #25 and #28 add to it. Doing it first avoids a 3-way conflict in the `dependencies` block.
- PR #25 (Husky) only touches `.husky/` and adds one `"prepare"` line to `package.json`. Merging it before structural PRs ensures the test gate is in place before bigger, riskier changes land.
- After Stage 1, every subsequent PR is protected by the pre-push test gate.

**Close as duplicate:** Choose **one** of PR #10 or PR #12 for the Cloudflare Pages migration (PR #12 is more complete — it updates AUTOMATIONS.md, SECURITY.md, and adds the GitHub Actions preview workflow). Close PR #10 as a duplicate of PR #12.

---

### Stage 2 — Major Structural Shifts *(merge in this order)*

8. **PR #12** — Cloudflare Pages migration (removes `netlify.toml`, adds `_headers`, `cloudflare-preview.yml`)
9. **PR #28** — TypeScript migration (renames all `.jsx`→`.tsx`, adds TypeScript config, CSS modules, component tests)
10. **PR #26** — UI Redesign (full `index.css` rewrite — must come **after** PR #28 renames the files it references)
11. **PR #15** — Remove floating SOS button (small surgery on `App.tsx` + `index.css` — apply on top of #26's new CSS)

**Why this order prevents Merge Hell:**
- PR #12 only affects deployment config and docs — zero code overlap with any other Stage 2 PR.
- PR #28 renames every source file from `.jsx` to `.tsx`. **It must be merged before any other PR that modifies `App.jsx`** — once it lands, all open PRs pointing at `.jsx` will need rebasing against `.tsx`. This is the single largest "blast radius" PR and must be the first code-change in Stage 2.
- PR #26 rewrites `index.css` from scratch. Doing it after PR #28 means it targets the correct (TypeScript) file tree. If #26 merged before #28, the next rebase of #28 would conflict in `index.css` on every style line.
- PR #15 (remove floating SOS) makes a small targeted deletion. Doing it after #26's CSS rewrite means there is nothing to delete — the floating SOS CSS block may already be absent in the v3 design. Verify this before merging #15; it may become a no-op.

---

### Stage 3 — Content & Compliance *(merge in this order)*

12. **PR #11** — i18next, DOMPurify, lazy loading, a11y enhancements (rebase on top of the TypeScript file tree first)
13. **PR #14** — Auto-translate, browser language detection, PWA install button (rebase after #11 lands, as both modify `AppContext`)
14. **PR #23** — UK GDPR consent gate, privacy notice, ICO rights (small, isolated — inserts `<ConsentBanner>` and updates `MorePage`)
15. **PR #16** — Free Stuff sub-tabs restructure + coverage workflow (data-heavy; rebase after #14 to avoid SavesPage conflicts)
16. **PR #24** — Fix broken URLs (URL-only changes; merge after content is stable)
17. **Close PR #27** (empty, no files committed) or reopen if work resumes
18. **Close PR #29** (duplicate of #24 for the same URL fixes; cherry-pick any non-overlapping fixes if needed)

**Why this order prevents Merge Hell:**
- PRs #11 and #14 both add state to `AppContext`. Merging #11 first gives a stable base; #14 can then add its state fields to the already-updated context without writing over #11's additions.
- PR #23 is the most isolated feature PR — it adds new files (`ConsentBanner.jsx`, `lib/sentry.js`) and touches `App.jsx` in only 4 lines. Doing it after #11 and #14 ensures the consent banner renders inside the already-established i18n and auto-translate wrappers.
- PR #16 restructures data files and `SavesPage` heavily. Doing it last in Stage 3 ensures all content data from #24/#29 has already landed, so PR #16 doesn't have to be rebased over URL-fix conflicts.

---

## Task 3 · Conflict Resolution Guide

For each high-conflict file pair, here is which PR's logic takes precedence and how to resolve quickly in your IDE.

---

### `App.jsx` — PRs #11 vs #14 vs #15 vs #16 vs #23

**Merge order:** #15 → #16 → #11 → #14 → #23

| Conflict Zone | Which PR wins | Resolution rule |
|---------------|---------------|----------------|
| Import block (top ~20 lines) | **#14** | Accept all new imports from both PRs; no deletions except the floating SOS import removed by #15 |
| `<Routes>` / routing block | **#16** | Accept #16's restructured routes; manually verify `<SavesPage>` route path didn't change |
| Floating SOS `<button>` block | **#15** (delete it) | Accept deletion from #15; if #26 already removed the CSS, this is a no-op |
| `<ConsentBanner />` insertion | **#23** | Accept addition; place it just before `</div>` that closes the `app-root` |
| Language overlay / `showLang` logic | **#14** | #14's auto-detect logic supersedes #11's simpler i18next hook — accept #14, manually port any a11y improvements from #11 |

---

### `index.css` — PRs #11, #14, #15 vs #26

**Rule: PR #26 wins entirely.**

PR #26 is a deliberate full rewrite (v2 → v3 design system). Do not attempt to merge individual hunks.

**Procedure:**
1. Merge PR #26 first (accepting its entire file).
2. Open the diff of PRs #11, #14, and #15 side-by-side.
3. Cherry-pick only the **new** utility classes added by #11 (e.g., `.font-system`) and #14 (e.g., `.translate-overlay`) that are genuinely absent from #26's new design system.
4. PR #15's CSS deletions (`.floating-sos`, `@keyframes sosPulse`) are very likely already absent in PR #26's rewrite — verify and skip if so.

---

### `AppContext.jsx` — PRs #11 vs #14

**Rule: Merge #11 first; rebase #14 on top.**

| What #11 adds | What #14 adds | Resolution |
|---------------|---------------|------------|
| `i18n` state (from i18next) | `autoLang` + `browserLang` detection + `translate()` function | Accept both; they are different state fields. Place #14's additions after #11's i18n block. |
| New context key: `i18nReady` | New context key: `autoTranslate` | No clash — accept both keys |

---

### `data/guides.js` + `data/jobs.js` — PRs #15, #16, #24, #29

**Rule: Merge in the order #15 → #24 → #16.**

| Conflict zone | Which PR wins | Resolution |
|---------------|---------------|------------|
| SSP rate (guides.js line ~40) | **#15** (`£118.75/week`) | #15 fixes the SSP value; accept it |
| URL replacements (jobs.js, guides.js) | **#24** (or #29 — pick one, close other) | Accept URL-only string replacements; they are non-semantic |
| Content structure (category/tab changes) | **#16** | #16 restructures the entire data shape; do this last and manually verify URL fixes from #24 are preserved |

---

### `package.json` — PRs #9, #25, #28

**Rule: Accept all three diffs.**

The three changes touch different sections of the JSON:
- #9: removes one entry from `dependencies`
- #25: adds one `"prepare"` entry to `scripts`
- #28: adds six entries to `devDependencies`

There is no semantic conflict. When resolving 3-way diffs in your IDE, accept **all incoming changes** and verify the JSON is still valid.

---

### TypeScript PR (#28) vs Feature PRs (#11, #14, #16, #23)

**This is the most dangerous conflict in the entire PR backlog.**

PR #28 renames every `.jsx` file to `.tsx`. All other feature PRs (#11, #14, #16, #23) reference the old `.jsx` filenames in their diffs. Once #28 lands on `main`, every open feature PR will have a broken diff header (`--- a/nluk/src/App.jsx` pointing to a non-existent file).

**Resolution procedure after merging #28:**
1. Run `git fetch origin main` on each feature branch.
2. `git rebase origin/main` — git will show each hunk as a conflict because the target filename changed.
3. Use `git add -u` after manually accepting the `.tsx` versions.
4. Re-run `npm run lint && npm test` before pushing.

---

## Task 4 · CI/CD Validation Check

### Current Workflow Inventory (on `main`)

| Workflow | Trigger | Status |
|----------|---------|--------|
| `ci.yml` — Build & Test | push / PR | ✅ Passing |
| `codeql-analysis.yml` | push / PR / weekly | ✅ Passing |
| `security-audit.yml` | push / PR | ✅ Passing |
| `bundle-size.yml` | push / PR | ✅ Passing |
| `lighthouse.yml` | push / PR | ✅ Passing |
| No Cloudflare Pages preview | — | ⚠️ Not yet in `main` — lands with PR #12 |

### Impact of Merging PR #28 (TypeScript)

| CI Step | Would it fail? | Why | Fix needed? |
|---------|----------------|-----|-------------|
| `npm ci` (install deps) | ✅ No | `typescript` and `@types/*` are now in `package.json` | None |
| `npm run lint` (ESLint) | ✅ No | PR #28 already updates `eslint.config.js` with `@typescript-eslint` parser | None |
| `npm run test` (Vitest) | ✅ No | Vitest handles `.ts`/`.tsx` natively via Vite plugin | None |
| `npm run build` (Vite) | ✅ No | Vite uses esbuild for TypeScript — transpile-only, ignores type errors | None |
| **TypeScript type errors** | ⚠️ **Silent** | The current `ci.yml` has **no `tsc --noEmit` step**. Type errors will build fine but are invisible to CI | **Add `tsc --noEmit` step** |

### Required CI Workflow Update

Add a **TypeScript type-check step** to `ci.yml`. The step is gated on the presence of `tsconfig.json` so it is safe to merge now — it becomes active only after PR #28 lands.

See the updated `ci.yml` in this PR for the exact change.

### Cloudflare Pages Preview (PR #12)

PR #12 adds `.github/workflows/cloudflare-preview.yml`. After it merges, every subsequent PR will get a live Cloudflare Pages preview URL posted to the PR thread. The preview build also runs `npm run build`, so it will catch the same build errors as CI.

**After merging PR #28 on top of PR #12:** the Cloudflare Pages build step is identical to the CI build step — it runs `npm run build` which uses Vite/esbuild. TypeScript type errors will not fail the Cloudflare build either, which is why the `tsc --noEmit` addition to `ci.yml` is needed.

---

## Task 5 · Post-Merge Sanity Check List

*Use this list after your first 5 PRs are merged (suggested: PRs #1, #9, #18/19/21/22, #25, #12).*

Open the Cloudflare Preview URL in a browser and verify each item manually.

### ✅ Checklist

#### Infrastructure integrity
- [ ] App loads without a white screen or console errors (open DevTools → Console)
- [ ] PWA manifest is present: `<site>/manifest.webmanifest` returns a valid JSON response
- [ ] Service worker registers: DevTools → Application → Service Workers shows "Activated and is running"
- [ ] `npm audit` reports zero high/critical vulnerabilities (CI check should confirm)

#### Husky + Lint gate (PR #25)
- [ ] Make a trivial change locally, run `git commit` — ESLint fires on staged `.jsx` files
- [ ] Run `git push` — pre-push hook executes `npm test` before push succeeds
- [ ] Test intentionally fails: pre-push hook blocks the push and shows the failure message

#### Cloudflare Pages preview (PR #12)
- [ ] A Cloudflare Pages preview comment appears on the PR thread after each push
- [ ] Preview URL is accessible (not a 404 or Cloudflare error page)
- [ ] SPA routing works on the preview: navigate to `/work/jobs` directly in the address bar (should not 404)
- [ ] Security headers are present: check via `curl -I <preview-url>` — look for `Content-Security-Policy`, `X-Frame-Options`, and `X-Content-Type-Options`

#### ESLint/React version fix (PR #9)
- [ ] Run `npm run lint` locally — no warnings about React version detection
- [ ] `eslint.config.js` correctly declares `react: { version: '19.2' }`

#### License file (PR #9)
- [ ] `LICENSE` file is present at repo root
- [ ] GitHub "MIT" badge on the repo summary page is green

#### Deprecated APIs (PR #9)
- [ ] Open DevTools → Console on the live site — no warnings about `onFID` being deprecated
- [ ] Sentry (if DSN is configured) receives a `web_vitals.inp` metric, not `web_vitals.fid`

---

### Extended Checklist for When Stages 2 & 3 Also Land

*Apply these after merging the TypeScript PR (#28), UI Redesign (#26), auto-translate (#14), and GDPR (#23).*

#### TypeScript migration (PR #28)
- [ ] Run `npx tsc --noEmit` locally — zero type errors
- [ ] All existing tests pass: `npm test`
- [ ] No import paths reference old `.jsx` extensions (search: `from '*.jsx'`)
- [ ] Component test files (`JobCard.test.tsx`, `SOSModal.test.tsx`, etc.) all pass

#### UI Redesign (PR #26)
- [ ] Dark mode toggle works: toggle in ⚙ Settings — body switches between light and dark
- [ ] Tab bar is visible and functional on mobile viewport (375 px wide)
- [ ] Header brand (`Logo` + "New Life UK") renders correctly
- [ ] Card components on Guides, Work, and Saves pages have correct spacing (no overlapping elements)
- [ ] Accessible: run Lighthouse (via CI) — Accessibility score ≥ 90

#### Auto-translate + language switcher (PR #14)
- [ ] Language switcher overlay opens when tapping the globe/language button
- [ ] Select "Arabic" → page content switches to Arabic script, layout direction flips to RTL
- [ ] Select "English" → layout returns to LTR
- [ ] Browser language auto-detection: open the site in a browser set to French — verify it defaults to French
- [ ] Translation cache (`nluk_tx3` in localStorage) is populated after a language switch

#### GDPR consent gate (PR #23)
- [ ] First visit (no `nluk_consent` in localStorage): consent banner appears at the bottom
- [ ] Click "OK, that's fine" → banner disappears, `nluk_consent = granted` in localStorage
- [ ] Clear localStorage, revisit → banner reappears
- [ ] Click "No thanks" → banner disappears, `nluk_consent = denied`, Sentry is **not** initialised
- [ ] More → Privacy → "Crash reports: on/off" toggle works and persists across refresh
- [ ] "Clear all app data" button wipes all `nluk_*` localStorage keys and reloads the page

#### Language switcher in the new UI (overlap: PR #26 + PR #14)
- [ ] Language grid renders inside PR #26's new overlay styles (not the old `.lang-overlay` box)
- [ ] Each language flag and name are visible in the new card design
- [ ] Closing the language overlay returns to the correct page (not always `/`)

---

*This document was generated as part of [PR #30](https://github.com/na7hanw/new-life-uk/pull/30). Update it as PRs are merged and closed.*
