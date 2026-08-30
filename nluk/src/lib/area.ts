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
export function areaOf(input: string): string {
  return input.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? ''
}

/**
 * The storage key an earlier version of this app used, when it kept the whole
 * postcode instead of the area. AppContext reads it once to carry the value
 * over, reduces it through areaOf, and then deletes it — so a device that ran
 * the old version stops holding a full postcode the next time the app opens.
 *
 * Kept as a named constant rather than inline so the only place this app still
 * refers to whole postcodes is one line of migration code with an expiry date
 * on it. Once the deployed audience has all opened the app at least once, this
 * constant and its two uses can go.
 */
export const SUPERSEDED_AREA_KEY = 'nluk_postcode'
