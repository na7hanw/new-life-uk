/**
 * Does a URL belong to one of these hosts?
 *
 * Written because several checks used `url.includes('gov.uk')`, which is not a
 * host check at all: https://evil.example.com/?ref=gov.uk passes it. In tests
 * asserting "this guide links to an official source", that is the difference
 * between testing something and testing nothing — the same shape as an
 * assertion that reads a property which does not exist and passes on the
 * fallback.
 *
 * Matches the host exactly or as a subdomain, so 'gov.uk' accepts
 * www.gov.uk and nationalcareers.service.gov.uk, and rejects
 * gov.uk.evil.com and anything carrying the string in a path or query.
 */
export function isFromHost(url: string, domain: string): boolean {
  let host: string
  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    return false
  }
  const d = domain.toLowerCase().replace(/^\.+/, '')
  return host === d || host.endsWith(`.${d}`)
}

/** True when the URL belongs to any of the supplied domains. */
export function isFromAnyHost(url: string, domains: readonly string[]): boolean {
  return domains.some(d => isFromHost(url, d))
}
