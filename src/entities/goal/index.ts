export { goalSchema, DEFAULT_GOAL, loadGoal, saveGoal } from './model/storage'
export type { GoalState } from './model/storage'
export { toMonths, projectGrowth, summarizeGoal } from './lib/calc'
export type { GrowthPoint, GoalSummary } from './lib/calc'
