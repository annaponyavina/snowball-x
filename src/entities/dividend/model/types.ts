import type { PaymentType } from '@/shared/api'

/** Статус выплаты относительно текущей даты. */
export type PaymentStatus = 'paid' | 'announced' | 'forecast'

/** Категория для окраски (статус купона либо погашение/амортизация). */
export type PaymentCategory = PaymentStatus | 'principal'

/** Единичное событие выплаты по позиции в портфеле. */
export interface DividendEvent {
  id: string
  /** ISO-дата YYYY-MM-DD */
  date: string
  bondId: string
  bondName: string
  short: string
  /** Выплата на одну бумагу */
  perUnit: number
  /** Сумма выплаты по всей позиции */
  amount: number
  /** Доходность выплаты к стоимости позиции, % */
  yieldPct: number
  type: PaymentType
  status: PaymentStatus
}
