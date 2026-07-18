import { z } from 'zod'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/shared/lib/storage'

let hidden = readStorage(STORAGE_KEYS.balanceHidden, z.boolean(), false)
const listeners = new Set<() => void>()

/** Стор видимости денежных сумм (скрытие баланса), сохраняется в localStorage. */
export const balanceStore = {
  subscribe(callback: () => void): () => void {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
  getSnapshot(): boolean {
    return hidden
  },
  toggle(): void {
    hidden = !hidden
    writeStorage(STORAGE_KEYS.balanceHidden, hidden)
    for (const listener of listeners) listener()
  },
}
