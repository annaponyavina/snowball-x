import type { Bond } from '@/shared/api'

/** Рыночная стоимость позиции: количество × котировка. */
export function getBondValue(bond: Bond): number {
  return bond.quantity * bond.price
}

/** Годовой купон на одну бумагу (только купоны, без амортизации/погашения). */
export function getBondAnnualCouponPerUnit(bond: Bond): number {
  return bond.coupons
    .filter((c) => (c.type ?? 'coupon') === 'coupon')
    .reduce((sum, c) => sum + c.amountPerUnit, 0)
}

/** Годовой купонный доход по позиции. */
export function getBondAnnualIncome(bond: Bond): number {
  return bond.quantity * getBondAnnualCouponPerUnit(bond)
}

/** Суммарная стоимость портфеля. */
export function getPortfolioTotal(bonds: Bond[]): number {
  return bonds.reduce((sum, b) => sum + getBondValue(b), 0)
}

/** Суммарный годовой пассивный доход по портфелю. */
export function getPortfolioAnnualIncome(bonds: Bond[]): number {
  return bonds.reduce((sum, b) => sum + getBondAnnualIncome(b), 0)
}

/** Процент годового пассивного дохода к стоимости портфеля. */
export function getPortfolioYield(bonds: Bond[]): number {
  const total = getPortfolioTotal(bonds)
  return total === 0 ? 0 : (getPortfolioAnnualIncome(bonds) / total) * 100
}

/** Доля позиции в портфеле, %. */
export function getBondShare(bond: Bond, total: number): number {
  return total === 0 ? 0 : (getBondValue(bond) / total) * 100
}

/* ---- Вложено / прибыль / дневное изменение ---- */

/** Вложено в позицию: количество × цена покупки. */
export function getBondInvested(bond: Bond): number {
  return bond.quantity * bond.purchasePrice
}

/** Прибыль/убыток по позиции (по цене): стоимость − вложено. */
export function getBondProfit(bond: Bond): number {
  return getBondValue(bond) - getBondInvested(bond)
}

/** Прибыль/убыток по позиции, % к вложенному. */
export function getBondProfitPct(bond: Bond): number {
  const invested = getBondInvested(bond)
  return invested === 0 ? 0 : (getBondProfit(bond) / invested) * 100
}

/** Изменение стоимости позиции за день, ₽. */
export function getBondDayChange(bond: Bond): number {
  return bond.quantity * (bond.price - bond.previousPrice)
}

/** Суммарно вложено в портфель. */
export function getPortfolioInvested(bonds: Bond[]): number {
  return bonds.reduce((sum, b) => sum + getBondInvested(b), 0)
}

/** Прибыль/убыток портфеля, ₽. */
export function getPortfolioProfit(bonds: Bond[]): number {
  return getPortfolioTotal(bonds) - getPortfolioInvested(bonds)
}

/** Прибыль/убыток портфеля, % к вложенному (он же «рост активов»). */
export function getPortfolioProfitPct(bonds: Bond[]): number {
  const invested = getPortfolioInvested(bonds)
  return invested === 0 ? 0 : (getPortfolioProfit(bonds) / invested) * 100
}

/** Изменение стоимости портфеля за день, ₽. */
export function getPortfolioDayChange(bonds: Bond[]): number {
  return bonds.reduce((sum, b) => sum + getBondDayChange(b), 0)
}

/** Изменение стоимости портфеля за день, %. */
export function getPortfolioDayChangePct(bonds: Bond[]): number {
  const prev = bonds.reduce((sum, b) => sum + b.quantity * b.previousPrice, 0)
  return prev === 0 ? 0 : (getPortfolioDayChange(bonds) / prev) * 100
}

/** Совокупная доходность портфеля: (прибыль по цене + годовой купон) / вложено, %. */
export function getPortfolioReturnPct(bonds: Bond[]): number {
  const invested = getPortfolioInvested(bonds)
  if (invested === 0) return 0
  return ((getPortfolioProfit(bonds) + getPortfolioAnnualIncome(bonds)) / invested) * 100
}

/* ---- Цвета активов (единые для диаграммы и таблицы) ---- */

export const ASSET_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  '#8b5cf6',
  '#14b8a6',
  '#f472b6',
  '#38bdf8',
] as const

/** Стабильная карта «id облигации → цвет» по порядку в портфеле. */
export function getAssetColorMap(bonds: Bond[]): Map<string, string> {
  return new Map(bonds.map((b, i) => [b.id, ASSET_COLORS[i % ASSET_COLORS.length]]))
}
