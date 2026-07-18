export type {
  DividendEvent,
  PaymentStatus,
  PaymentCategory,
} from './model/types'
export { buildDividendEvents, deriveStatus, getCategory } from './lib/build'
export {
  getYearTotal,
  getMonthlyAverage,
  getDailyAverage,
  getEventsInMonth,
  getMonthTotal,
  getEventsByDay,
  getMonthlyBuckets,
} from './lib/aggregate'
export type { MonthBucket } from './lib/aggregate'
export { CATEGORY_ORDER, CATEGORY_COLOR } from './lib/style'
