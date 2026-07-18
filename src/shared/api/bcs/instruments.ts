import { BCS_BASE_URL } from '@/shared/config/env'
import type { CouponPayment } from '../types'
import { getAccessToken } from './auth'
import type { BcsInstrument } from './types'

const INSTRUMENTS_URL = `${BCS_BASE_URL}/trade-api-information-service/api/v1/instruments/by-tickers`

/** Горизонт купонного календаря — 12 месяцев вперёд от ближайшей выплаты. */
const HORIZON_MONTHS = 12

/** Прибавить месяцы к UTC-дате с корректировкой «переполнения» короткого месяца. */
function addMonthsUTC(date: Date, months: number): Date {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  const target = new Date(Date.UTC(year, month + months, 1))
  const daysInTarget = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate()
  target.setUTCDate(Math.min(day, daysInTarget))
  return target
}

/** ISO-дата YYYY-MM-DD из UTC-даты (без времени и сдвига часового пояса). */
function isoDateUTC(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Разобрать дату погашения/оферты формата YYYYMMDD в UTC-дату. */
function parseMaturity(raw: string): Date | null {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(raw)
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
}

/**
 * Построить график купонов на одну бумагу на 12 месяцев вперёд.
 * Купоны шагают от ближайшей выплаты (nextCoupon) с периодом 12/couponsPerYear
 * месяцев и обрываются на дате погашения/оферты, если она наступает раньше.
 * Сумма одного купона = номинал × ставка/100 ÷ число купонов в год.
 */
export function buildCouponSchedule(instrument: BcsInstrument): CouponPayment[] {
  const { couponsPerYear, couponRate, faceValue, nextCoupon, maturityDate } = instrument
  if (!couponsPerYear || !couponRate || !faceValue || !nextCoupon) return []

  const first = new Date(nextCoupon)
  if (Number.isNaN(first.getTime())) return []

  const stepMonths = Math.max(1, Math.round(12 / couponsPerYear))
  const amountPerUnit = (faceValue * couponRate) / 100 / couponsPerYear
  const horizonEnd = addMonthsUTC(first, HORIZON_MONTHS)
  const maturity = parseMaturity(maturityDate)

  const coupons: CouponPayment[] = []
  let cursor = first
  // Ограничиваем число итераций на случай неожиданных данных.
  for (let i = 0; i < 64 && cursor < horizonEnd; i++) {
    if (maturity && cursor > maturity) break
    coupons.push({ date: isoDateUTC(cursor), amountPerUnit })
    cursor = addMonthsUTC(cursor, stepMonths)
  }
  return coupons
}

/** Эффективная дата погашения/оферты в ISO YYYY-MM-DD (или undefined). */
export function getMaturityIso(instrument: BcsInstrument): string | undefined {
  const maturity = parseMaturity(instrument.maturityDate)
  return maturity ? isoDateUTC(maturity) : undefined
}

/**
 * Загрузить справочную информацию по инструментам (купоны, оферта/погашение).
 * POST by-tickers с Bearer-токеном; в браузере — через dev-proxy `/bcs`.
 */
export async function fetchInstruments(tickers: string[]): Promise<BcsInstrument[]> {
  if (tickers.length === 0) return []
  const token = await getAccessToken()
  const res = await fetch(INSTRUMENTS_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tickers }),
  })
  if (!res.ok) {
    throw new Error(`BCS: не удалось получить справочник инструментов (${res.status})`)
  }
  return (await res.json()) as BcsInstrument[]
}
