import type { Bond } from '@/shared/api'
import { getBondValue } from '@/entities/bond'
import type { DividendEvent, PaymentCategory, PaymentStatus } from '../model/types'

/** Горизонт, в пределах которого будущая выплата считается «объявленной». */
const ANNOUNCE_WINDOW_DAYS = 35

const DAY_MS = 24 * 60 * 60 * 1000

/** Полночь указанной даты (для сравнения без учёта времени). */
function atMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** Статус выплаты: прошедшая — выплачена, ближайшая — объявлена, дальняя — прогноз. */
export function deriveStatus(dateIso: string, today: Date = new Date()): PaymentStatus {
  const pay = atMidnight(new Date(dateIso))
  const now = atMidnight(today)
  if (pay < now) return 'paid'
  if (pay <= now + ANNOUNCE_WINDOW_DAYS * DAY_MS) return 'announced'
  return 'forecast'
}

/** Категория окраски: погашение/амортизация приоритетнее статуса. */
export function getCategory(event: DividendEvent): PaymentCategory {
  return event.type === 'coupon' ? event.status : 'principal'
}

/** Развернуть облигации портфеля в плоский список событий выплат. */
export function buildDividendEvents(bonds: Bond[], today: Date = new Date()): DividendEvent[] {
  const events: DividendEvent[] = []
  for (const bond of bonds) {
    const value = getBondValue(bond)
    bond.coupons.forEach((coupon, i) => {
      const type = coupon.type ?? 'coupon'
      const amount = bond.quantity * coupon.amountPerUnit
      events.push({
        id: `${bond.id}-${i}`,
        date: coupon.date,
        bondId: bond.id,
        bondName: bond.name,
        short: bond.short,
        perUnit: coupon.amountPerUnit,
        amount,
        yieldPct: value === 0 ? 0 : (amount / value) * 100,
        type,
        status: deriveStatus(coupon.date, today),
      })
    })
  }
  return events.sort((a, b) => a.date.localeCompare(b.date))
}
