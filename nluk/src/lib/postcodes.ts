/**
 * Postcodes.io integration
 *
 * Free, open-source UK postcode validation and enrichment API.
 * No API key required. Source: https://postcodes.io
 * Repo: https://github.com/ideal-postcodes/postcodes.io
 *
 * Use cases in this app:
 * - Validate a postcode entered by the user
 * - Enrich location with ward, district, CCG (NHS area), coordinates
 * - Support "near me" discovery flows
 * - Form validation with clear error messages
 *
 * Fails gracefully: all functions return null / false on error or network failure.
 */

const POSTCODES_BASE = 'https://api.postcodes.io'

// Simple in-memory cache to avoid duplicate lookups
const _cache = new Map<string, unknown>()

/** Sentinel thrown when the network call itself fails (no connectivity, timeout, etc.) */
export class PostcodesNetworkError extends Error {
  constructor() { super('postcodes_network_error') }
}

async function pcFetch<T>(path: string): Promise<T | null> {
  const cached = _cache.get(path)
  if (cached !== undefined) return cached as T | null

  let res: Response
  try {
    res = await fetch(`${POSTCODES_BASE}${path}`)
  } catch {
    throw new PostcodesNetworkError()
  }

  if (res.status === 404) {
    _cache.set(path, null)
    return null
  }
  if (!res.ok) return null
  const json = await res.json() as { status: number; result: T }
  const result = json.status === 200 ? json.result : null
  _cache.set(path, result)
  return result
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PostcodeResult {
  postcode: string
  quality: number
  eastings: number
  northings: number
  country: string
  nhs_ha: string | null
  longitude: number
  latitude: number
  european_electoral_region: string | null
  primary_care_trust: string | null
  region: string | null
  lsoa: string | null
  msoa: string | null
  incode: string
  outcode: string
  parliamentary_constituency: string | null
  admin_district: string | null
  parish: string | null
  admin_county: string | null
  date_of_introduction: string
  admin_ward: string | null
  ced: string | null
  ccg: string | null                  // Clinical Commissioning Group (NHS area)
  nuts: string | null
  pfa: string | null
  codes: {
    admin_district: string
    admin_county: string
    admin_ward: string
    parish: string
    ccg: string
    ccg_id: string
    ced: string
    nuts: string
    lsoa: string
    msoa: string
    lau2: string
    pfa: string
  }
}

export interface OutcodeResult {
  outcode: string
  longitude: number
  latitude: number
  northings: number
  eastings: number
  admin_district: string[]
  parish: string[]
  admin_county: string[]
  admin_ward: string[]
  country: string[]
}

// ── Normalisation ─────────────────────────────────────────────────────────────

/**
 * Normalises a UK postcode to uppercase with a space in the standard position.
 * e.g. 'sw1a1aa' → 'SW1A 1AA', 'SW1A1AA' → 'SW1A 1AA'
 */
export function normalisePostcode(raw: string): string {
  const stripped = raw.replace(/\s+/g, '').toUpperCase()
  // UK postcodes: 1-4 char outcode + 3 char incode
  if (stripped.length < 5 || stripped.length > 8) return raw.toUpperCase()
  const incode = stripped.slice(-3)
  const outcode = stripped.slice(0, stripped.length - 3)
  return `${outcode} ${incode}`
}

/**
 * Quick regex check for a plausible UK postcode format.
 * This does NOT guarantee the postcode exists — use validatePostcode() for that.
 */
export function looksLikePostcode(raw: string): boolean {
  const p = raw.replace(/\s+/g, '').toUpperCase()
  return /^[A-Z]{1,2}[0-9][0-9A-Z]?[0-9][A-Z]{2}$/.test(p)
}

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * Validates a postcode against the Postcodes.io API.
 * Returns true if the postcode exists and is valid, false otherwise.
 */
export async function validatePostcode(postcode: string): Promise<boolean> {
  const p = normalisePostcode(postcode).replace(/\s+/g, '')
  if (!looksLikePostcode(postcode)) return false
  const result = await pcFetch<boolean>(`/postcodes/${encodeURIComponent(p)}/validate`)
  return result === true
}

/**
 * Looks up a full postcode and returns enriched data including coordinates,
 * NHS area (CCG), admin district, ward, and region.
 * Returns null if the postcode is not found or the API fails.
 */
export async function lookupPostcode(postcode: string): Promise<PostcodeResult | null> {
  const p = normalisePostcode(postcode).replace(/\s+/g, '')
  if (!looksLikePostcode(postcode)) return null
  return pcFetch<PostcodeResult>(`/postcodes/${encodeURIComponent(p)}`)
}

/**
 * Looks up an outcode (the first part of a postcode, e.g. 'SW1A').
 * Returns region-level data without a specific address.
 */
export async function lookupOutcode(outcode: string): Promise<OutcodeResult | null> {
  const o = outcode.replace(/\s+/g, '').toUpperCase()
  return pcFetch<OutcodeResult>(`/outcodes/${encodeURIComponent(o)}`)
}

/**
 * Finds postcodes near a given latitude/longitude coordinate.
 * Returns up to `limit` nearby postcodes (default 5, max 100).
 */
export async function nearestPostcodes(
  latitude: number,
  longitude: number,
  limit = 5,
): Promise<PostcodeResult[]> {
  const path = `/postcodes?lon=${longitude}&lat=${latitude}&limit=${limit}`
  const result = await pcFetch<PostcodeResult[]>(path)
  return result ?? []
}

/**
 * Returns a plain-language area description from a lookup result.
 * e.g. "Lambeth, London, South East" or just "Manchester, North West"
 */
export function describeArea(result: PostcodeResult): string {
  const parts = [
    result.admin_ward,
    result.admin_district,
    result.region,
  ].filter(Boolean)
  return parts.join(', ')
}

/**
 * Returns the NHS Clinical Commissioning Group name for a postcode result.
 * Useful for pointing users to their local NHS area / GP registration area.
 */
export function getNHSArea(result: PostcodeResult): string | null {
  return result.ccg ?? result.primary_care_trust ?? null
}

/**
 * Clears the in-memory Postcodes.io cache.
 */
export function clearPostcodesCache(): void {
  _cache.clear()
}
