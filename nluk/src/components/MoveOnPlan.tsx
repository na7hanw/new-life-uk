import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays, format } from 'date-fns'
import clsx from 'clsx'
import { computeMoveOnPlan, MOVE_ON_ACTIONS, UC_WAIT_DAYS } from '../lib/moveOn.ts'
import styles from './MoveOnPlan.module.css'

interface Props {
  /**
   * ISO date PRINTED ON the grant letter — its issue date, not the day it
   * arrived. The Home Office counts the 42 days from issue.
   */
  statusDate: string
  setStatusDate: (d: string) => void
  /** ISO date on the asylum support discontinuation letter. */
  discontinuationDate: string
  setDiscontinuationDate: (d: string) => void
  /** ISO date the provider's Notice to Quit requires the property vacated. */
  noticeToQuitDate: string
  setNoticeToQuitDate: (d: string) => void
}

/**
 * The move-on plan: what to do, in what order, against a real deadline.
 *
 * Replaces a countdown that used only one of the two statutory clocks and
 * refused to accept a grant date in the future — so the person who most needs
 * to prepare, the one who knows their grant is days away, could not use it.
 */
export default function MoveOnPlan({
  statusDate,
  setStatusDate,
  discontinuationDate,
  setDiscontinuationDate,
  noticeToQuitDate,
  setNoticeToQuitDate,
}: Props) {
  const navigate = useNavigate()

  const plan = useMemo(
    () => computeMoveOnPlan({ grantDate: statusDate, discontinuationDate, noticeToQuitDate }),
    [statusDate, discontinuationDate, noticeToQuitDate]
  )

  const { deadline, daysLeft, accommodationDeadline, supportFloor, ucBufferDays, noticeLooksShort, entitlementFloor } = plan
  const hasDate = deadline !== null && daysLeft !== null
  const isPast = hasDate && daysLeft! < 0
  const isUrgent = hasDate && !isPast && daysLeft! <= 14
  const grant = statusDate ? new Date(statusDate) : null

  return (
    <section className={styles.wrap} aria-labelledby="move-on-heading">
      <h2 id="move-on-heading" className={styles.heading}>
        Your move-on plan
      </h2>

      <div className={clsx(styles.banner, isUrgent && styles.urgent, isPast && styles.past)}>
        {hasDate ? (
          <>
            <div className={styles.days}>
              {isPast ? `${Math.abs(daysLeft!)} days past your deadline` : `${daysLeft} days left`}
            </div>
            <div className={styles.deadlineLine}>
              You must leave asylum accommodation by{' '}
              <strong>{format(deadline!, 'EEEE d MMMM yyyy')}</strong>
            </div>

            {noticeLooksShort && entitlementFloor && (
              <p className={styles.shortNotice}>
                ⚠ Your Notice to Quit expires <strong>before</strong> the date the
                rules give you. Counting from your grant letter you should have
                until <strong>{format(entitlementFloor, 'd MMMM yyyy')}</strong>.
                A short notice is not automatically a valid one. Take both
                letters to the council&apos;s housing team and to a free adviser
                before you pack — and do not leave voluntarily first, because
                that can count against you.
              </p>
            )}

            {/* Show the working. Three dates run and people are routinely told
                only about the one on whichever letter they happened to read. */}
            <ul className={styles.clocks}>
              {accommodationDeadline && (
                <li>
                  42 days from your grant letter → {format(accommodationDeadline, 'd MMM yyyy')}
                </li>
              )}
              {supportFloor ? (
                <li>
                  28 days from your discontinuation letter → {format(supportFloor, 'd MMM yyyy')}
                </li>
              ) : (
                <li className={styles.muted}>
                  Add your discontinuation letter date below — it can push your deadline later.
                </li>
              )}
              <li className={styles.muted}>Whichever is later is your real deadline.</li>
            </ul>
          </>
        ) : (
          <>
            <div className={styles.days}>42-day move-on</div>
            <div className={styles.deadlineLine}>
              Enter your decision date below. You can enter a date in the future to plan ahead.
            </div>
          </>
        )}
      </div>

      {/* The five-week wait, not the deadline, is usually what decides this. */}
      {hasDate && ucBufferDays !== null && (
        <p className={clsx(styles.ucNote, ucBufferDays < 0 && styles.ucNoteBad)}>
          {ucBufferDays < 0 ? (
            <>
              ⚠ If you claim Universal Credit today, the first payment arrives{' '}
              <strong>{Math.abs(ucBufferDays)} days after</strong> you have to leave. Claim today
              anyway, ask for an Advance in the same session, and request a support extension from
              Migrant Help on <a href="tel:08088010503">0808 801 0503</a>.
            </>
          ) : (
            <>
              Universal Credit takes {UC_WAIT_DAYS} days to pay. Claiming today leaves{' '}
              <strong>{ucBufferDays} days</strong> of margin before your deadline — ask for an
              Advance to bridge it.
            </>
          )}
        </p>
      )}

      <div className={styles.dates}>
        <div className={styles.dateField}>
          <label htmlFor="grant-date">Date printed on your grant letter</label>
          <input
            id="grant-date"
            type="date"
            value={statusDate}
            onChange={e => setStatusDate(e.target.value)}
          />
          <p className={styles.fieldHint}>
            Use the date on the letter, not the day it reached you — the Home
            Office counts 42 days from when it was issued.
          </p>
        </div>
        <div className={styles.dateField}>
          <label htmlFor="disc-date">Date on your discontinuation letter (optional)</label>
          <input
            id="disc-date"
            type="date"
            value={discontinuationDate}
            onChange={e => setDiscontinuationDate(e.target.value)}
          />
        </div>
        <div className={styles.dateField}>
          <label htmlFor="ntq-date">Date your Notice to Quit says to leave (optional)</label>
          <input
            id="ntq-date"
            type="date"
            value={noticeToQuitDate}
            onChange={e => setNoticeToQuitDate(e.target.value)}
          />
          <p className={styles.fieldHint}>
            Your accommodation provider sends this after the grant letter. Keep
            it — the council will ask for it.
          </p>
        </div>
        {(statusDate || discontinuationDate) && (
          <button
            className={styles.clear}
            onClick={() => { setStatusDate(''); setDiscontinuationDate('') }}
          >
            Clear dates
          </button>
        )}
      </div>

      <h3 className={styles.subheading}>What to do, in order</h3>
      <ol className={styles.actions}>
        {MOVE_ON_ACTIONS.map(a => {
          const due = grant ? addDays(grant, a.byDay) : null
          const overdue = due ? due < new Date() : false
          return (
            <li key={a.id} className={styles.action}>
              <div className={styles.actionHead}>
                <span className={clsx(styles.when, overdue && styles.whenOverdue)}>
                  {due ? format(due, 'd MMM') : `Day ${a.byDay}`}
                </span>
                <span className={styles.actionTitle}>{a.title}</span>
              </div>
              <p className={styles.actionDetail}>{a.detail}</p>
              {a.script && (
                <blockquote className={styles.script}>
                  <span className={styles.scriptLabel}>Say this:</span> “{a.script}”
                </blockquote>
              )}
              {a.guideId && (
                <button className={styles.guideLink} onClick={() => navigate(`/guide/${a.guideId}`)}>
                  Open the guide →
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
