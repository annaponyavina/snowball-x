import type { GoalState } from '../model/storage'

/** Перевести срок в месяцы. */
export function toMonths(termValue: number, termUnit: 'months' | 'years'): number {
  return Math.max(1, Math.round(termUnit === 'years' ? termValue * 12 : termValue))
}

export interface GrowthPoint {
  /** Номер месяца (0 — старт) */
  month: number
  /** Накопленный капитал */
  value: number
  /** Внесено взносами к этому моменту */
  contributed: number
}

interface ProjectInput {
  monthly: number
  annualRate: number
  months: number
  reinvest: boolean
}

/**
 * Помесячная траектория роста капитала.
 * reinvest=true — сложный процент (доход капитализируется).
 * reinvest=false — простой процент (доход начисляется только на взносы,
 * сам на себя не работает).
 */
export function projectGrowth({
  monthly,
  annualRate,
  months,
  reinvest,
}: ProjectInput): GrowthPoint[] {
  const r = annualRate / 100 / 12
  const points: GrowthPoint[] = [{ month: 0, value: 0, contributed: 0 }]

  if (reinvest) {
    let balance = 0
    for (let n = 1; n <= months; n++) {
      balance = balance * (1 + r) + monthly
      points.push({ month: n, value: balance, contributed: monthly * n })
    }
  } else {
    let principal = 0
    let interest = 0
    for (let n = 1; n <= months; n++) {
      interest += principal * r // доход на уже внесённый капитал, без капитализации
      principal += monthly
      points.push({ month: n, value: principal + interest, contributed: principal })
    }
  }

  return points
}

export interface GoalSummary {
  finalValue: number
  totalContributed: number
  totalInterest: number
  monthlyPassiveIncome: number
  annualPassiveIncome: number
  /** Месяц достижения цели (null — не достигнута за срок) */
  monthsToTarget: number | null
}

/** Итоги по цели: капитал, доход, срок достижения цели. */
export function summarizeGoal(
  points: GrowthPoint[],
  goal: Pick<GoalState, 'annualRate' | 'target'>,
): GoalSummary {
  const last = points[points.length - 1]
  const finalValue = last.value
  const totalContributed = last.contributed
  const reached = goal.target > 0 ? points.find((p) => p.value >= goal.target) : undefined

  return {
    finalValue,
    totalContributed,
    totalInterest: finalValue - totalContributed,
    annualPassiveIncome: (finalValue * goal.annualRate) / 100,
    monthlyPassiveIncome: (finalValue * goal.annualRate) / 100 / 12,
    monthsToTarget: reached ? reached.month : null,
  }
}
