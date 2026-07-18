import i18n from '@/shared/config/i18n'
import type { Currency } from '@/shared/api/types'

const LOCALES: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}

/** Текущая локаль Intl на основе выбранного языка i18n. */
function locale(): string {
  return LOCALES[i18n.language] ?? 'ru-RU'
}

/** Денежное форматирование с учётом валюты и языка. */
export function formatMoney(value: number, currency: Currency = 'RUB'): string {
  return new Intl.NumberFormat(locale(), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

/** Денежное значение с возможностью скрытия (режим «спрятать баланс»). */
export function maskMoney(
  value: number,
  hidden: boolean,
  currency: Currency = 'RUB',
): string {
  return hidden ? '••• ₽' : formatMoney(value, currency)
}

/** Число с разделителями разрядов. */
export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(locale(), {
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/** Проценты, значение передаётся как есть (9.2 → «9,2 %»). */
export function formatPercent(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat(locale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value) + ' %'
}

/** Дата из ISO-строки (YYYY-MM-DD) в локальном формате. */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat(locale(), {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Короткое название месяца (year, month 1-indexed): «июл.». */
export function formatMonthShort(year: number, month: number): string {
  return new Intl.DateTimeFormat(locale(), { month: 'short' }).format(
    new Date(year, month - 1, 1),
  )
}

/** Месяц и год: «июль 2026». */
export function formatMonthYear(year: number, month: number): string {
  return new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

/** Компактная сумма для подписей графика: «202K ₽». */
export function formatMoneyCompact(value: number, currency: Currency = 'RUB'): string {
  return new Intl.NumberFormat(locale(), {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/** Короткие названия дней недели, начиная с понедельника: [пн, вт, …, вс]. */
export function getWeekdayLabels(): string[] {
  const fmt = new Intl.DateTimeFormat(locale(), { weekday: 'short' })
  // 2024-01-01 — понедельник
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)))
}
