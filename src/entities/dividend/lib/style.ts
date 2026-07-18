import type { PaymentCategory } from '../model/types'

/** Порядок категорий (для стека графика и легенды). */
export const CATEGORY_ORDER: PaymentCategory[] = [
  'paid',
  'announced',
  'forecast',
  'principal',
]

/** Цвет категории (CSS-переменная темы). */
export const CATEGORY_COLOR: Record<PaymentCategory, string> = {
  paid: 'var(--status-paid)',
  announced: 'var(--status-announced)',
  forecast: 'var(--status-forecast)',
  principal: 'var(--status-principal)',
}
