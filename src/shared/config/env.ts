import type { ApiSource } from '@/shared/api/types'

/**
 * Источник данных портфеля. Управляется переменной окружения
 * VITE_API_SOURCE (mock | bcs). По умолчанию — mock, т.к. реальный
 * бэкенд БКС пока недоступен.
 */
export const API_SOURCE: ApiSource =
  import.meta.env.VITE_API_SOURCE === 'bcs' ? 'bcs' : 'mock'

/**
 * Базовый префикс для запросов к БКС. По умолчанию — `/bcs`, который
 * проксируется дев-сервером Vite на https://be.broker.ru (см. vite.config.ts),
 * что снимает CORS в браузере.
 */
export const BCS_BASE_URL: string = import.meta.env.VITE_BCS_BASE_URL ?? '/bcs'

/** Refresh-токен БКС из окружения (получается в веб-версии БКС Мир инвестиций). */
export const BCS_REFRESH_TOKEN: string = import.meta.env.VITE_BCS_REFRESH_TOKEN ?? ''
