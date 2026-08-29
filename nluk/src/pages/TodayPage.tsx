import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../context/AppContext.tsx'
import MoveOnPlan from '../components/MoveOnPlan.tsx'
import RentCheck from '../components/RentCheck.tsx'
import {
  ASSET_ACTIONS,
  ASSET_LABELS,
  assessAll,
  biggestUnlock,
  type Asset,
} from '../lib/blockers.ts'
import styles from './TodayPage.module.css'

/** Order shown in the checklist: the order they can actually be obtained. */
const ASSET_CHECKLIST: Asset[] = [
  'decision-letter',
  'ukvi-account',
  'share-code',
  'ni-number',
  'uc-claim',
  'bank-account',
]

/**
 * The home screen: what to do today.
 *
 * The app used to open on the guide library — 60+ topics, alphabetical by
 * category. That is a good reference and a poor first screen. Someone on day 3
 * of a 42-day move-on does not have a browsing problem, they have a sequencing
 * problem, and the answer they need is one sentence long: this is the thing
 * that is blocking the most other things, go and do this.
 *
 * So the library moved to /guides and this took its place. Everything here is
 * derived from lib/blockers.ts rather than hard-coded, so the advice cannot
 * drift out of step with the dependency rules it is supposed to express.
 */
export default function TodayPage() {
  const navigate = useNavigate()
  const {
    assetsHeld,
    toggleAsset,
    userArea,
    statusDate,
    setStatusDate,
    discontinuationDate,
    setDiscontinuationDate,
  } = useApp()

  const goals = useMemo(() => assessAll(assetsHeld), [assetsHeld])
  const focus = useMemo(() => biggestUnlock(assetsHeld), [assetsHeld])

  const unlocks = useMemo(
    () => (focus ? goals.filter(g => g.nextAsset === focus).map(g => g.goal.label) : []),
    [goals, focus]
  )

  const focusAction = focus ? ASSET_ACTIONS[focus] : null

  return (
    <div>
      <p className={styles.intro}>
        Tick off what you already have. The app works out what that unblocks and
        what to do next — nothing here is stored anywhere but on this device.
      </p>

      {/* ── The single next action ─────────────────────────────── */}
      <section className={clsx(styles.focus, !focus && styles.done)} aria-labelledby="focus-h">
        <div className={styles.focusLabel}>
          {focus ? 'Do this next' : 'Nothing is blocked'}
        </div>
        <h2 id="focus-h" className={styles.focusTitle}>
          {focus ? ASSET_LABELS[focus] : 'You have everything the plan depends on'}
        </h2>
        <p className={styles.body}>
          {focusAction
            ? focusAction.action
            : 'Every step below is now open to you. Work through the move-on plan in date order.'}
        </p>
        {unlocks.length > 0 && (
          <p className={styles.note}>
            This one unblocks: {unlocks.join(', ')}.
          </p>
        )}
        {focusAction?.guideId && (
          <button
            type="button"
            className={styles.link}
            onClick={() => navigate(`/guide/${focusAction.guideId}`)}
          >
            Read the full steps →
          </button>
        )}
      </section>

      {/* ── What you have ──────────────────────────────────────── */}
      <h2 className={styles.heading}>What you have</h2>
      <ul className={styles.assets}>
        {ASSET_CHECKLIST.map(a => {
          const held = assetsHeld.includes(a)
          return (
            <li key={a}>
              <button
                type="button"
                className={clsx(styles.assetBtn, held && styles.assetOn)}
                aria-pressed={held}
                onClick={() => {
                  navigator?.vibrate?.(5)
                  toggleAsset(a)
                }}
              >
                <span aria-hidden="true">{held ? '✓' : '○'}</span>
                {ASSET_LABELS[a]}
              </button>
            </li>
          )
        })}
      </ul>
      <p className={styles.hint}>
        If you came off asylum support you will have had an ARC card, not a BRP —
        so your UKVI account does not exist until status is granted.
      </p>

      {/* ── What that means ────────────────────────────────────── */}
      <h2 className={styles.heading}>What you can do now</h2>
      <ul className={styles.goals}>
        {goals.map(({ goal, ready, missing }) => (
          <li key={goal.id} className={clsx(styles.goal, ready && styles.goalReady)}>
            <div className={styles.goalRow}>
              <span className={styles.goalName}>{goal.label}</span>
              <span className={clsx(styles.badge, ready && styles.badgeReady)}>
                {ready ? 'Ready' : 'Blocked'}
              </span>
            </div>

            {!ready && (
              <p className={styles.note}>
                Waiting on: {missing.map(m => ASSET_LABELS[m]).join(', ')}
              </p>
            )}

            <p className={styles.why}>{goal.why}</p>

            {goal.notRequired && <p className={styles.notRequired}>⚠ {goal.notRequired}</p>}

            {goal.guideId && (
              <button
                type="button"
                className={styles.link}
                onClick={() => navigate(`/guide/${goal.guideId}`)}
              >
                Read the full steps →
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* ── Can I afford this room? ────────────────────────────── */}
      <h2 className={styles.heading}>Can you afford this room?</h2>
      <RentCheck postcode={userArea} />

      {/* ── The clock ──────────────────────────────────────────── */}
      <h2 className={styles.heading}>Your deadline</h2>
      <MoveOnPlan
        statusDate={statusDate}
        setStatusDate={setStatusDate}
        discontinuationDate={discontinuationDate}
        setDiscontinuationDate={setDiscontinuationDate}
      />
    </div>
  )
}
