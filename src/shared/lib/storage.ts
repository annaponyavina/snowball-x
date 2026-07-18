import type { ZodType } from 'zod'

/** Единая точка формирования ключей localStorage приложения. */
export const STORAGE_KEYS = {
  theme: 'snowball-x:theme',
  language: 'snowball-x:language',
  balanceHidden: 'snowball-x:balance-hidden',
  mockLoaded: 'snowball-x:mock-loaded',
  investments: 'snowball-x:investments',
  goal: 'snowball-x:goal',
} as const

/**
 * Прочитать и валидировать значение из localStorage.
 * При отсутствии/повреждении/несоответствии схеме возвращает fallback.
 */
export function readStorage<T>(key: string, schema: ZodType<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = schema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    return fallback
  }
}

/** Записать значение в localStorage (сериализация JSON). */
export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* переполнение/недоступность хранилища игнорируем */
  }
}

/** Удалить значение из localStorage. */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* noop */
  }
}
