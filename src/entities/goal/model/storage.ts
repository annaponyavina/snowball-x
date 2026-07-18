import { z } from 'zod'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/shared/lib/storage'

export const goalSchema = z.object({
  /** Целевая сумма капитала, к которой идём */
  target: z.number().nonnegative(),
  /** Ежемесячное пополнение */
  monthly: z.number().nonnegative(),
  /** Процент годовых, % */
  annualRate: z.number().nonnegative(),
  /** Срок (в единицах termUnit) */
  termValue: z.number().positive(),
  termUnit: z.enum(['months', 'years']),
  /** С учётом реинвестирования (сложный процент) */
  reinvest: z.boolean(),
})

export type GoalState = z.infer<typeof goalSchema>

export const DEFAULT_GOAL: GoalState = {
  target: 3_000_000,
  monthly: 30_000,
  annualRate: 12,
  termValue: 10,
  termUnit: 'years',
  reinvest: true,
}

/** Прочитать настройки цели из localStorage (или значения по умолчанию). */
export function loadGoal(): GoalState {
  return readStorage(STORAGE_KEYS.goal, goalSchema, DEFAULT_GOAL)
}

/** Сохранить настройки цели в localStorage. */
export function saveGoal(state: GoalState): void {
  writeStorage(STORAGE_KEYS.goal, state)
}
