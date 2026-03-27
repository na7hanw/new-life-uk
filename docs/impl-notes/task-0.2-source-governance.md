# Task 0.2 — Source Governance Labels

_Internal implementation note. Last updated: 2026-03-27._

---

## Summary of changes

Extended `lib/schema.ts` with a new `SourceLabelSchema` Zod enum and `SOURCE_LABEL_META` display map.
Added `sourceLabel`, `lastVerified`, and `eligibilityNotes` fields to all content schemas.
Added test enforcement for official-source URL domain checks.

---

## New enum — `SourceLabelSchema`

Location: `nluk/src/lib/schema.ts`

```typescript
export const SourceLabelSchema = z.enum([
  'official-government',   // GOV.UK, HMRC, DVLA, Home Office, NHS
  'official-scheme',       // CSCS, CITB, DVSA-approved schemes
  'awarding-body',         // City & Guilds, NOCN, Pearson, BTEC
  'official-guidance',     // Official guidance / codes of practice (non-statutory)
  'training-provider',     // Accredited college or training provider
  'support-tool',          // App or portal that assists users, no authoritative standing
])
```

`TrustLevel` ('official' | 'ngo' | 'charity' | 'commercial') is unchanged — it controls filtering
and display tiers. `SourceLabel` is the fine-grained classification of *what kind* of authority
is behind the content.

---

## Display metadata — `SOURCE_LABEL_META`

```typescript
export const SOURCE_LABEL_META: Record<SourceLabel, { emoji: string; display: string }> = {
  'official-government': { emoji: '🏛️', display: 'Official government' },
  'official-scheme':     { emoji: '✅', display: 'Official scheme' },
  'awarding-body':       { emoji: '🎓', display: 'Awarding body' },
  'official-guidance':   { emoji: '📋', display: 'Official guidance' },
  'training-provider':   { emoji: '🏫', display: 'Training provider' },
  'support-tool':        { emoji: '🛠️', display: 'Support tool' },
}
```

Import from `lib/schema.ts` wherever UI badges need rendering.

---

## Schema field additions per content type

### GuideSchema (existing content type)

| New field | Type | Notes |
|---|---|---|
| `sourceLabel` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date, e.g. `"March 2026"` |

`sourceUrl` for guides continues to live in the external `GUIDE_SOURCE_URL` map (enforced by tests).
`trustLevel` was already present.

### CertSchema (new content type)

| New field | Type | Notes |
|---|---|---|
| `trustLevel` | `TrustLevel?` | Broad tier |
| `sourceLabel` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date |
| `eligibilityNotes` | `string[]?` | Who is eligible / restrictions |

`sourceUrl` for certs continues in the external `CERT_SOURCE_URL` map (enforced by tests).

### CareerSchema (new content type)

| New field | Type | Notes |
|---|---|---|
| `trustLevel` | `TrustLevel?` | Broad tier |
| `sourceLabel` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date |
| `eligibilityNotes` | `string[]?` | Who is eligible / restrictions |

`sourceUrl` for careers continues in the external `CAREER_SOURCE_URL` map (enforced by tests).

### SaveItemSchema (apps / tools)

| New field | Type | Notes |
|---|---|---|
| `sourceLabel` | `SourceLabel?` | Fine-grained authority classification |

`trustLevel` and `lastVerified` were already present.

---

## Exported types

Both are exported from `lib/schema.ts` and re-exported from `types.ts`:

```typescript
export type TrustLevel = z.infer<typeof TrustLevelSchema>
export type SourceLabel = z.infer<typeof SourceLabelSchema>
```

`SaveItem` interface in `types.ts` now uses `TrustLevel` (not `string`) and adds `SourceLabel`.

---

## Test enforcement

Added to `__tests__/schema.test.ts` — describe block: **"Source label governance"**

1. `SOURCE_LABEL_META covers all SourceLabel enum values` — ensures the display map is exhaustive.
2. `guides with official-government or official-scheme sourceLabel have an official sourceUrl` —
   checks `GUIDE_SOURCE_URL[id]` is on one of: `gov.uk`, `nhs.uk`, `cscs.uk.com`, `citb.co.uk`, `dvsa.gov.uk`.
3. Same check for certs (against `CERT_SOURCE_URL`).
4. Same check for careers (against `CAREER_SOURCE_URL`).

These tests enforce the rule: CSCS, CITB, DVSA routes must link to official pages, not third-party
intermediaries like training companies or magazine explainers.

---

## Convention for new entries

Every new cert, career, guide, or app entry added in subsequent tasks must include:

```typescript
{
  // ...content fields...
  trustLevel:    'official',          // broad tier
  sourceLabel:   'official-scheme',   // specific authority type
  lastVerified:  'March 2026',        // human-readable date
  // sourceUrl goes in the external map (CERT_SOURCE_URL / GUIDE_SOURCE_URL etc.)
  // eligibilityNotes on certs/careers: ['Must have right to work', ...]
}
```

Official-source entries (`official-government`, `official-scheme`, `awarding-body`) must use the
actual official page (e.g. `cscs.uk.com/get-your-card`, `gov.uk/dvsa`) rather than secondary
explainers or training-company landing pages.
