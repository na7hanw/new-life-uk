import { useMemo, useState } from 'react'
import { computeBudget, lhaFor, capForSingleAdult, keptFromEarnings } from '../lib/budget.ts'
import styles from './RentCheck.module.css'

const money = (n: number) =>
  `${n < 0 ? '−' : ''}£${Math.abs(n).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

interface Props {
  /** Saved postcode, used to pick the right Local Housing Allowance area. */
  postcode: string
}

/**
 * "Can I afford this room?"
 *
 * The app could say what someone was entitled to but never what it came to once
 * rent was paid — which is the question actually being asked, usually while
 * standing in the room, with a landlord waiting for an answer.
 *
 * The two things that make the honest answer worse than the intuitive one are
 * stated rather than buried: a single person under 35 is capped at the shared
 * rate whatever they rent, and with no work allowance the taper takes 55p of
 * every pound earned.
 */
export default function RentCheck({ postcode }: Props) {
  const [rent, setRent] = useState('')
  const [earnings, setEarnings] = useState('')

  const rates = useMemo(() => lhaFor(postcode), [postcode])
  const rentNum = Number(rent)
  const earningsNum = Number(earnings) || 0
  const valid = rates !== null && rent !== '' && Number.isFinite(rentNum) && rentNum > 0

  const budget = useMemo(() => {
    if (!valid || !rates) return null
    return computeBudget({
      rent: rentNum,
      lhaCap: capForSingleAdult(rates, 30),
      earnings: earningsNum,
    })
  }, [valid, rates, rentNum, earningsNum])

  if (!rates) {
    return (
      <p className={styles.none}>
        Add your postcode in the Me tab to check what a room would leave you with
        after rent.
      </p>
    )
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.cap}>
        In <strong>{rates.area}</strong>, Universal Credit pays at most{' '}
        <strong>{money(rates.shared)}</strong> a month towards rent for a single
        person under 35 — the shared room rate, which applies even if you rent a
        flat of your own.
      </p>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Monthly rent</span>
          <input
            className={styles.input}
            type="number"
            inputMode="decimal"
            min="0"
            step="10"
            placeholder="450"
            value={rent}
            onChange={e => setRent(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Monthly earnings</span>
          <input
            className={styles.input}
            type="number"
            inputMode="decimal"
            min="0"
            step="10"
            placeholder="0"
            value={earnings}
            onChange={e => setEarnings(e.target.value)}
          />
        </label>
      </div>

      {budget && (
        <div className={styles.result} role="status">
          <div className={styles.big}>
            {money(budget.leftOver)} <span className={styles.per}>left a month</span>
          </div>
          <div className={styles.perDay}>
            {money(budget.perDay)} a day for food, energy, travel and everything else
          </div>

          {budget.shortfall > 0 && (
            <p className={styles.warn}>
              ⚠ {money(budget.shortfall)} of this rent is above what Universal
              Credit will pay. It comes out of the{' '}
              {money(Math.max(0, budget.ucAwarded - budget.housingElement))} of
              Universal Credit meant for living costs.
            </p>
          )}

          {earningsNum > 0 && (
            <p className={styles.note}>
              Of the {money(earningsNum)} you earn, you keep{' '}
              <strong>{money(keptFromEarnings(earningsNum))}</strong>. Universal
              Credit drops by 55p for every £1 — there is no work allowance for a
              single person with no children.
            </p>
          )}

          {budget.leftOver < 0 && (
            <p className={styles.warn}>
              ⚠ This does not add up. Look for a cheaper room, or one with bills
              included — that is worth £60–£100 a month of real money.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
