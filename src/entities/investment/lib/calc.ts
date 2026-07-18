import type { Investment } from '../model/store'

/** Общая сумма вложенных средств. */
export function getTotalInvested(investments: Investment[]): number {
  return investments.reduce((sum, item) => sum + item.amount, 0)
}
