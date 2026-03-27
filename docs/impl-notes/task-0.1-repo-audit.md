# Task 0.1 — Repo Structure Audit

_Internal implementation note. Last updated: 2026-03-27._

---

## 1. Content type → file path mapping

| Content type | File path | Status |
|---|---|---|
| Guides | `nluk/src/data/guides.ts` | Present — 100+ entries |
| Jobs | `nluk/src/data/jobs.ts` | Present — 15+ entries |
| Apps / tools / portals | `nluk/src/data/apps.ts` | Present — 70+ entries |
| Free resources | `nluk/src/data/saves.ts` | Present — 50 entries |
| Emergency / SOS | `nluk/src/data/emergency.ts` | Present |
| Immigration updates | `nluk/src/data/immigration-updates.ts` | Present |
| Culture | `nluk/src/data/culture.ts` | Present |
| Glossary | `nluk/src/data/glossary.ts` | Present |
| **Careers** | — | **Absent** — schema exists in `lib/schema.ts`; no data file yet |
| **Certs / licences** | — | **Absent** — schema exists in `lib/schema.ts`; no data file yet |

Schemas are centralised in `nluk/src/lib/schema.ts` (Zod). TypeScript export types live in `nluk/src/types.ts`.

---

## 2. Schema field audit

### GuideSchema (`data/guides.ts`)

| Requested field | Implemented as | Notes |
|---|---|---|
| `id` | `id: string` | Required |
| `title` | `content.en.title: string` | i18n-wrapped; `en` required |
| `summary` | `content.en.summary: string` | i18n-wrapped |
| `steps` | `content.en.steps: string[]` | i18n-wrapped; min 1 item |
| `relatedItems` | `relatedGuideIds?: string[]` + `relatedAppIds?: string[]` | Cross-references guides and apps |
| `sourceUrl` | `GUIDE_SOURCE_URL` map at end of file | Record\<guideId, url\>; enforced by tests for high-risk guides |
| `trustLevel` | `trustLevel?: 'official'\|'ngo'\|'charity'\|'commercial'` | Optional inline; test-enforced for legal/immigration guides |
| `lastVerified` | Not on GuideSchema directly | `GUIDE_SOURCE_URL` acts as implicit freshness signal; see immigration-updates for dated entries |
| `eligibilityNotes` | Partial — `limitations?: string[]` + `warnings?: string[]` | No discrete `eligibilityNotes` field; content is split across `limitations`, `warnings`, and `bring` arrays |

Additional guide fields: `cat`, `icon`, `links[]`, `cost`, `time`, `bring[]`.

### CertSchema (`lib/schema.ts` — no data file yet)

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Required |
| `icon` | `string` | Required |
| `content.en.title` | `string` | i18n-wrapped |
| `content.en.sector` | `string?` | Optional |
| `cost` | `string` | Required |
| `time` | `string` | Required |
| `freeRoute` | `string` | Required |
| `steps.en` | `string[]` | i18n-wrapped steps |
| `links[]` | `LinkSchema[]?` | Optional |
| `studyLinks[]` | `LinkSchema[]?` | Optional |

`eligibilityNotes`, `trustLevel`, `lastVerified`, and `sourceUrl` are **not** on CertSchema. Add them when creating `data/certs.ts`.

### CareerSchema (`lib/schema.ts` — no data file yet)

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Required |
| `icon` | `string` | Required |
| `content.en.title` | `string` | i18n-wrapped |
| `content.en.salary` | `string` | i18n-wrapped |
| `tags` | `string[]` | Min 1 |
| `steps.en` | `string[]` | i18n-wrapped steps |
| `links[]` | `LinkSchema[]?` | Optional |

Same gaps as CertSchema: `eligibilityNotes`, `trustLevel`, `lastVerified`, `sourceUrl` are absent. Add when creating `data/careers.ts`.

### SaveItemSchema — apps / tools / portals (`data/apps.ts`, `data/saves.ts`)

| Requested field | Implemented as | Notes |
|---|---|---|
| `id` | None (no explicit id) | Items referenced by title string in trust maps |
| `title` | `content.en.title: string` | i18n-wrapped |
| `summary` | `content.en.desc: string` | i18n-wrapped |
| `steps` | Not applicable | Navigation/portal items, not procedural |
| `relatedItems` | `guideId?: string` | Single guide cross-reference |
| `sourceUrl` | `url?: string` (URL-validated) + `APP_SOURCE_URL` map | `url` is the app's own URL; `APP_SOURCE_URL` maps title → authoritative override |
| `trustLevel` | `trustLevel?` inline + `APP_TRUST_LEVEL` map | Inline or via external map |
| `lastVerified` | `lastVerified?: string` | Human-readable date string, e.g. `"March 2026"` |
| `eligibilityNotes` | Not present | Add if needed per-item |

### ImmigrationUpdateSchema (`data/immigration-updates.ts`)

This schema has the most complete trust/source metadata and is the reference model:

```
id, title, sourceUrl, sourceType, publishedAt, lastChecked,
summary, affectedGroups, whatChanged, whatToDo, urgency,
relatedGuideIds, relatedAppIds
```

`lastChecked` is the equivalent of `lastVerified` here (ISO date string).

---

## 3. App / tool resources — current state

`data/apps.ts` is the home for all app and tool resources, including:
- Official portals (GOV.UK One Login, UKVI eVisa, HMRC, Companies House, FCA Register)
- Revision / learning apps (Duolingo, Skills Bootcamp, National Careers Service)
- Health (NHS App, NHS 111)
- Finance, transport, housing, food, jobs boards, legal (Citizens Advice)

**Adding a new app/tool:** add a `SaveItem` object to the relevant section in `data/apps.ts` and, if high-risk, add its title to `APP_SOURCE_URL` and `APP_TRUST_LEVEL` at the bottom of the file. Tests enforce that both maps stay in sync.

**Revision apps specifically** fit naturally under `cat: "Learning"` or a new `cat: "Revision"` within `data/apps.ts`.

---

## 4. Personalisation rules — current location

All profile state is managed in `nluk/src/context/AppContext.tsx`.

| State key | Type | Purpose |
|---|---|---|
| `userStatus` | `'asylum-seeker'\|'refugee'\|'other-visa'\|'settled'\|''` | Gates which content is visible |
| `statusDate` | ISO date string | Status change date |
| `claimDate` | ISO date string | Asylum claim date (milestone tracking) |
| `userAmbition` | `'work'\|'study'\|'business'\|'volunteer'\|''` | Drives guide/job recommendations |
| `userSector` | 12-value enum | Sector-specific job/guide filtering |
| `documentsHeld` | `string[]` | Document-based eligibility checking |
| `userPostcode` | `string` | Local service discovery |
| `bookmarks` | `string[]` | Saved items |
| `lang` | `string` | UI language |
| `dark` | `boolean` | Theme |

All keys persisted to `localStorage` with `nluk_` prefix. Filter logic lives in components/pages that consume `AppContext`.

---

## 5. Test suite location

`nluk/src/__tests__/` — 27 test files covering:
- Content integrity and schema validation (`content.test.ts`, `schema.test.ts`)
- Component rendering and interaction
- Search, translation coherence, and route translation
- Accessibility (`a11y.test.tsx`) and security (`DocumentScanner.security.test.ts`)
- PWA behaviour

Trust-map sync (GUIDE_SOURCE_URL, APP_SOURCE_URL, APP_TRUST_LEVEL) is enforced by `schema.test.ts` / `content.test.ts`.

---

## 6. Gaps and recommendations for new content

| Gap | Recommendation |
|---|---|
| No `data/careers.ts` | Create the file; follow CareerSchema. Add `trustLevel`, `sourceUrl`, `lastVerified`, `eligibilityNotes` fields to the schema extension. |
| No `data/certs.ts` | Create the file; follow CertSchema. Same schema extensions as careers. |
| `eligibilityNotes` is not a first-class field | For guides, repurpose `limitations[]` or add `eligibilityNotes?: string[]` to GuideSchema. For certs/careers, add it to the schema before creating data files. |
| `lastVerified` absent from GuideSchema | Add `lastVerified?: string` to GuideSchema and populate for new guides; no need to back-fill existing entries immediately. |
| Jobs have no formal `id` | Jobs are referenced by their `content.en.role` string. If cross-references from certs/careers are needed, add `id` to the job schema. |
| Apps have no `id` | Apps are referenced by title string in trust maps. Add `id` if cross-referencing from careers/certs. |

New content should match the `ImmigrationUpdateSchema` pattern for trust rigour: explicit `sourceUrl`, `sourceType`, `lastChecked`, and `affectedGroups`.
