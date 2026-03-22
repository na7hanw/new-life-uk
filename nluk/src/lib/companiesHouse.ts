/**
 * Companies House API integration
 *
 * Free UK government API for public company data.
 * Source: https://developer.company-information.service.gov.uk/
 * Rate limit: 600 requests per 5 minutes (per API key).
 *
 * SECURITY: Do NOT embed API keys in the frontend bundle.
 * Configure VITE_CH_API_KEY in your .env.local file (never commit to source).
 * If no key is set, requests are made without authentication (limited rate).
 *
 * Use cases in this app:
 * - Verify a company is real before trusting it (anti-scam)
 * - Look up an employer's official registration details
 * - Business & Money guide cross-referencing
 * - Companies House identity verification flows
 */

const CH_BASE_URL = 'https://api.company-information.service.gov.uk'
const CH_API_KEY: string = import.meta.env?.VITE_CH_API_KEY as string ?? ''

// Simple in-memory cache to avoid duplicate requests
const _cache = new Map<string, unknown>()

function chHeaders(): HeadersInit {
  if (!CH_API_KEY) return {}
  // Companies House uses HTTP Basic Auth: API key as username, empty password
  return {
    Authorization: `Basic ${btoa(`${CH_API_KEY}:`)}`,
  }
}

async function chFetch<T>(path: string): Promise<T> {
  const cached = _cache.get(path)
  if (cached) return cached as T

  const res = await fetch(`${CH_BASE_URL}${path}`, {
    headers: chHeaders(),
  })

  if (res.status === 404) return null as T
  if (!res.ok) throw new Error(`Companies House API error: ${res.status}`)

  const data = await res.json() as T
  _cache.set(path, data)
  return data
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CHAddress {
  address_line_1?: string
  address_line_2?: string
  locality?: string
  postal_code?: string
  country?: string
}

export interface CHCompany {
  company_number: string
  company_name: string
  company_status: string        // 'active' | 'dissolved' | 'liquidation' | ...
  company_type: string          // 'ltd' | 'plc' | 'llp' | ...
  date_of_creation?: string
  registered_office_address?: CHAddress
  jurisdiction?: string
}

export interface CHSearchResult {
  company_number: string
  company_name: string
  company_status: string
  company_type: string
  date_of_creation?: string
  address?: CHAddress
}

export interface CHSearchResponse {
  total_results: number
  items: CHSearchResult[]
}

// ── API functions ──────────────────────────────────────────────────────────────

/**
 * Search for companies by name.
 * Returns matching results ordered by relevance.
 *
 * @param query   - Company name search term
 * @param itemsPerPage - Number of results (default 10, max 100)
 */
export async function searchCompanies(
  query: string,
  itemsPerPage = 10,
): Promise<CHSearchResult[]> {
  if (!query || query.trim().length < 2) return []
  const q = encodeURIComponent(query.trim())
  const res = await chFetch<CHSearchResponse>(
    `/search/companies?q=${q}&items_per_page=${itemsPerPage}`
  )
  return res?.items ?? []
}

/**
 * Look up a company by its Companies House registration number.
 * Returns null if not found.
 *
 * @param companyNumber - e.g. '00000006' (8-digit, zero-padded)
 */
export async function getCompanyProfile(companyNumber: string): Promise<CHCompany | null> {
  const cleaned = companyNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!cleaned) return null
  return chFetch<CHCompany | null>(`/company/${cleaned}`)
}

/**
 * Returns true if the company is registered and currently active.
 * Use this for anti-scam verification: "is this a real, active company?"
 */
export async function isActiveCompany(companyNumber: string): Promise<boolean> {
  const profile = await getCompanyProfile(companyNumber)
  return profile?.company_status === 'active'
}

/**
 * Returns a human-readable company status description.
 */
export function describeCompanyStatus(status: string): string {
  const LABELS: Record<string, string> = {
    active:      '✅ Active — registered and operating',
    dissolved:   '❌ Dissolved — no longer a registered company',
    liquidation: '⚠ In liquidation',
    administration: '⚠ In administration',
    'voluntary-arrangement': '⚠ Voluntary arrangement',
    'converted-closed': 'Converted / closed',
    'insolvency-proceedings': '⚠ Insolvency proceedings',
  }
  return LABELS[status] ?? status
}

/**
 * Returns a formatted address string from a Companies House address object.
 */
export function formatCHAddress(addr?: CHAddress): string {
  if (!addr) return ''
  return [
    addr.address_line_1,
    addr.address_line_2,
    addr.locality,
    addr.postal_code,
    addr.country,
  ].filter(Boolean).join(', ')
}

/**
 * Clears the in-memory Companies House cache.
 * Useful in tests or when forcing fresh data.
 */
export function clearCHCache(): void {
  _cache.clear()
}
