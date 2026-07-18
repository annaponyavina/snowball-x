import { z } from 'zod'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/shared/lib/storage'

/** Одно вложение средств (заполняется вручную). */
export const investmentSchema = z.object({
  id: z.string(),
  /** ISO-дата YYYY-MM-DD */
  date: z.string(),
  /** Внесённая сумма */
  amount: z.number().positive(),
})

export type Investment = z.infer<typeof investmentSchema>

const listSchema = z.array(investmentSchema)

let investments: Investment[] = readStorage(STORAGE_KEYS.investments, listSchema, [])
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function persist() {
  writeStorage(STORAGE_KEYS.investments, investments)
}

/**
 * Реактивный стор вложений на базе localStorage.
 * Данные не синхронизируются с активами (по ТЗ) — это отдельный ручной список.
 */
export const investmentStore = {
  subscribe(callback: () => void): () => void {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
  getSnapshot(): Investment[] {
    return investments
  },
  add(input: { date: string; amount: number }): void {
    investments = [...investments, { id: crypto.randomUUID(), ...input }]
    persist()
    emit()
  },
  remove(id: string): void {
    investments = investments.filter((item) => item.id !== id)
    persist()
    emit()
  },
}
