import type { DividendEvent, PaymentCategory } from '../model/types'
import { getCategory } from './build'

/** Год и месяц (1-indexed) из ISO-даты. */
function ym(dateIso: string): [number, number] {
  const [y, m] = dateIso.split('-')
  return [Number(y), Number(m)]
}

/** Суммарная сумма всех выплат (год). */
export function getYearTotal(events: DividendEvent[]): number {
  return events.reduce((sum, e) => sum + e.amount, 0)
}

/** Средняя выплата в месяц (год / 12). */
export function getMonthlyAverage(events: DividendEvent[]): number {
  return getYearTotal(events) / 12
}

/** Средняя выплата в день (год / 365). */
export function getDailyAverage(events: DividendEvent[]): number {
  return getYearTotal(events) / 365
}

/** События указанного месяца. */
export function getEventsInMonth(
  events: DividendEvent[],
  year: number,
  month: number,
): DividendEvent[] {
  return events.filter((e) => {
    const [y, m] = ym(e.date)
    return y === year && m === month
  })
}

/** Сумма выплат за месяц. */
export function getMonthTotal(
  events: DividendEvent[],
  year: number,
  month: number,
): number {
  return getEventsInMonth(events, year, month).reduce((sum, e) => sum + e.amount, 0)
}

/** События месяца, сгруппированные по дню (1..31). */
export function getEventsByDay(
  events: DividendEvent[],
  year: number,
  month: number,
): Record<number, DividendEvent[]> {
  const byDay: Record<number, DividendEvent[]> = {}
  for (const e of getEventsInMonth(events, year, month)) {
    const day = Number(e.date.split('-')[2])
    ;(byDay[day] ??= []).push(e)
  }
  return byDay
}

export interface MonthBucket {
  year: number
  month: number
  total: number
  /** Доля месячной выплаты в стоимости портфеля, % (0 — если стоимость неизвестна) */
  pct: number
  paid: number
  announced: number
  forecast: number
  principal: number
}

const EMPTY_CATEGORIES: Record<PaymentCategory, number> = {
  paid: 0,
  announced: 0,
  forecast: 0,
  principal: 0,
}

/**
 * 12 месячных корзин, начиная с якорного месяца, с разбивкой сумм по категориям
 * (для столбчатого графика со стеком по статусам). Если передана стоимость
 * портфеля, у каждой корзины считается доля выплаты в портфеле (pct).
 */
export function getMonthlyBuckets(
  events: DividendEvent[],
  anchorYear: number,
  anchorMonth: number,
  portfolioValue = 0,
): MonthBucket[] {
  return Array.from({ length: 12 }, (_, i) => {
    const zero = anchorMonth - 1 + i
    const year = anchorYear + Math.floor(zero / 12)
    const month = (zero % 12) + 1
    const cats = { ...EMPTY_CATEGORIES }
    let total = 0
    for (const e of getEventsInMonth(events, year, month)) {
      cats[getCategory(e)] += e.amount
      total += e.amount
    }
    const pct = portfolioValue > 0 ? (total / portfolioValue) * 100 : 0
    return { year, month, total, pct, ...cats }
  })
}
