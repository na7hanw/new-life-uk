# Task 0.2 — Source Governance Labels

_Internal implementation note. Last updated: 2026-03-27._

---

## Summary of changes

Extended `lib/schema.ts` with `SourceLabelSchema` (a Zod enum) and `SOURCE_LABEL_META` (display
map). The field is named `resourceType` on every content object. All schemas also received
`lastVerified` and `eligibilityNotes` where missing. Tests enforce official-domain URLs for
authoritative entries.

Key principle: the `resourceType` field distinguishes **official route ownership**
(CITB owns construction training; CSCS owns card issuance; DVSA owns driving instruction approval)
from **this app's support role** (`support-service`). Content that is not authored or regulated
by the tagged body must never carry an authority label it does not hold.

---

## `resourceType` enum — `SourceLabelSchema`

Location: `nluk/src/lib/schema.ts`

```typescript
export const SourceLabelSchema = z.enum([
  'official-government',   // GOV.UK, HMRC, DVLA, Home Office, NHS — statutory body
  'official-scheme',       // CSCS, CITB, DVSA — regulated industry scheme
  'awarding-body',         // City & Guilds, NOCN, Pearson, BTEC — accredited qualification body
  'official-guidance',     // Official guidance / codes of practice (non-statutory)
  'professional-body',     // NRPSI, RICS, NMC, ICE, CIOL — sector professional body
  'approved-provider',     // Ofsted/regulator-approved training provider or college
  'support-service',       // App or portal supporting users; holds no regulatory authority
])
```

### Choosing the right label

| Situation | Label |
|---|---|
| Content sourced from GOV.UK, NHS, HMRC, Home Office | `official-government` |
| Content sourced from CSCS, CITB, DVSA, SIA | `official-scheme` |
| Content sourced from City & Guilds, NOCN, Pearson, BTEC | `awarding-body` |
| Official guidance document, code of practice (non-statutory) | `official-guidance` |
| Content sourced from NRPSI, RICS, NMC, ICE, CIOL | `professional-body` |
| Content about an Ofsted/regulator-approved training provider | `approved-provider` |
| App, portal, or tool that helps users but is not a regulator | `support-service` |

---

## Display metadata — `SOURCE_LABEL_META`

```typescript
export const SOURCE_LABEL_META: Record<SourceLabel, { emoji: string; display: string }> = {
  'official-government': { emoji: '🏛️', display: 'Official government' },
  'official-scheme':     { emoji: '✅', display: 'Official scheme' },
  'awarding-body':       { emoji: '🎓', display: 'Awarding body' },
  'official-guidance':   { emoji: '📋', display: 'Official guidance' },
  'professional-body':   { emoji: '🏅', display: 'Professional body' },
  'approved-provider':   { emoji: '🏫', display: 'Approved provider' },
  'support-service':     { emoji: '🛠️', display: 'Support service' },
}
```

Import from `lib/schema.ts` wherever UI badges need rendering. A test enforces that this map
stays exhaustive as the enum grows.

---

## Schema field additions per content type

### GuideSchema

| Field | Type | Notes |
|---|---|---|
| `trustLevel` | `TrustLevel?` | Broad tier — was already present |
| `resourceType` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date, e.g. `"March 2026"` |

`sourceUrl` for guides lives in the external `GUIDE_SOURCE_URL` map (enforced by tests).

### CertSchema (data file to be created)

| Field | Type | Notes |
|---|---|---|
| `trustLevel` | `TrustLevel?` | Broad tier |
| `resourceType` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date |
| `eligibilityNotes` | `string[]?` | Who is eligible / restrictions |

`sourceUrl` lives in `CERT_SOURCE_URL` external map.

### CareerSchema (data file to be created)

| Field | Type | Notes |
|---|---|---|
| `trustLevel` | `TrustLevel?` | Broad tier |
| `resourceType` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date |
| `eligibilityNotes` | `string[]?` | Who is eligible / restrictions |

`sourceUrl` lives in `CAREER_SOURCE_URL` external map.

### SaveItemSchema — apps / tools

| Field | Type | Notes |
|---|---|---|
| `trustLevel` | `TrustLevel?` | Broad tier — was already present |
| `resourceType` | `SourceLabel?` | Fine-grained authority classification |
| `lastVerified` | `string?` | Human-readable date — was already present |

---

## Exported types

Both exported from `lib/schema.ts` and re-exported from `types.ts`:

```typescript
export type TrustLevel = z.infer<typeof TrustLevelSchema>
export type SourceLabel = z.infer<typeof SourceLabelSchema>
```

`SaveItem` interface in `types.ts` uses `TrustLevel` (typed, not `string`) and `SourceLabel`
for `resourceType`.

---

## Test enforcement

`__tests__/schema.test.ts` — describe block: **"Source label governance"**

1. `SOURCE_LABEL_META covers all SourceLabel (resourceType) enum values` — exhaustiveness check.
2. `guides with official-government or official-scheme resourceType have an official sourceUrl` —
   `GUIDE_SOURCE_URL[id]` must be on: `gov.uk`, `nhs.uk`, `cscs.uk.com`, `citb.co.uk`, `dvsa.gov.uk`.
3. Same check for certs (`CERT_SOURCE_URL`).
4. Same check for careers (`CAREER_SOURCE_URL`).

This enforces the rule that CSCS, CITB, and DVSA entries point to official pages, not
third-party training companies, magazine explainers, or intermediaries.

---

## Convention for every new entry

```typescript
{
  // ...content fields...
  trustLevel:   'official',          // broad tier
  resourceType: 'official-scheme',   // specific authority type
  lastVerified: 'March 2026',        // human-readable date
  // sourceUrl → CERT_SOURCE_URL / GUIDE_SOURCE_URL / CAREER_SOURCE_URL external map
  // eligibilityNotes (certs/careers): ['Must have right to work', ...]
}
```

Official-source entries (`official-government`, `official-scheme`, `awarding-body`,
`professional-body`) must use the actual official page — not a secondary explainer,
not a training company's landing page, not a magazine article.
