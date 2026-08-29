import { useMemo } from 'react'
import { areaForPostcode, servicesFor, LOCAL_AREAS } from '../data/local.ts'
import styles from './LocalServices.module.css'

interface Props {
  /**
   * The postcode AREA only, e.g. "BL". The full postcode is never held —
   * see lib/postcode.ts. Typing a full one is fine; it is reduced on the way in.
   */
  postcode: string
  setPostcode: (p: string) => void
  status?: string
}

/**
 * Local services for wherever the user actually is.
 *
 * The app told people to "contact your local council housing team" without ever
 * saying which one or how — not actionable on day 3 of a 42-day clock. This
 * resolves a postcode to a real set of numbers, addresses and opening hours.
 *
 * Only the letter prefix is used for matching, and the postcode is stored on the
 * device like every other preference. It is not sent anywhere.
 */
export default function LocalServices({ postcode, setPostcode, status }: Props) {
  const area = useMemo(() => areaForPostcode(postcode), [postcode])
  const services = useMemo(() => servicesFor(area, status), [area, status])

  return (
    <section className={styles.wrap} aria-labelledby="local-heading">
      <h2 id="local-heading" className={styles.heading}>
        {area ? `Local to you — ${area.name}` : 'Local to you'}
      </h2>

      <div className={styles.postcodeRow}>
        <label htmlFor="local-postcode">Your postcode area</label>
        <input
          id="local-postcode"
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="e.g. BL"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
        />
      </div>

      {!area && (
        <p className={styles.none}>
          {postcode.trim()
            ? `No local services listed for “${postcode.trim()}” yet. Covered so far: ${LOCAL_AREAS.map(a => a.name).join(', ')}.`
            : 'Enter your postcode to see the council, charities and services where you live.'}
          {' '}Only the first letters are kept — enough to find your council,
          not enough to find your address. Stored on this device only, and never
          sent anywhere.
        </p>
      )}

      {services.map(s => (
        <article key={s.name} className={styles.card}>
          <h3 className={styles.name}>{s.name}</h3>
          <p className={styles.what}>{s.what}</p>
          <p className={styles.why}>{s.why}</p>

          <div className={styles.contacts}>
            {s.num && s.phone && (
              <a className={styles.contact} href={`tel:${s.phone}`}>📞 {s.num}</a>
            )}
            {s.email && (
              <a className={styles.contact} href={`mailto:${s.email}`}>✉️ {s.email}</a>
            )}
            {s.url && (
              <a className={styles.contact} href={s.url} target="_blank" rel="noopener noreferrer">
                🔗 Website
              </a>
            )}
          </div>

          {s.address && <p className={styles.meta}>📍 {s.address}</p>}
          {s.hours && <p className={styles.meta}>🕘 {s.hours}</p>}
        </article>
      ))}
    </section>
  )
}
