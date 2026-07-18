/** Пути разделов приложения. Используются роутером и сайдбаром. */
export const ROUTES = {
  dashboard: '/',
  calendar: '/calendar',
  investments: '/investments',
  goal: '/goal',
} as const

export type RouteKey = keyof typeof ROUTES
