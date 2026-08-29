/**
 * Keep the postcode area, discard the rest.
 *
 * CodeQL flagged nluk_postcode as clear-text storage of sensitive data, and it
 * is right to. For this app the home postcode is the most sensitive field
 * there is: it is the address of someone in asylum accommodation, and the
 * threat model that justifies Quick Exit and the wipe-everything action is
 * exactly a person who should not see it picking up the phone.
 *
 * The fix is not to encrypt it — a key kept beside the data on the same device
 * protects nobody. It is to stop holding it. Both consumers already match on
 * the letter prefix only: LOCAL_AREAS.prefixes in data/local.ts and
 * LHA_BY_PREFIX in lib/budget.ts. Nothing in the app has ever needed the rest,
 * so keeping "BL5 3SB" instead of "BL" bought no functionality and carried the
 * whole risk.
 *
 * "BL" identifies a borough of roughly 300,000 people. "BL5 3SB" identifies a
 * street.
 */

/**
 * The area letters of a UK postcode: the leading one or two letters of the
 * outward code. Returns '' when there are none, so an unparseable value stores
 * nothing rather than storing itself.
 */
export function postcodeArea(input: string): string {
  return input.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? ''
}
