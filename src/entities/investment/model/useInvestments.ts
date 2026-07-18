import { useSyncExternalStore } from 'react'
import { investmentStore } from './store'
import type { Investment } from './store'

/** Подписка на список вложений из стора (реактивно к add/remove). */
export function useInvestments(): Investment[] {
  return useSyncExternalStore(
    investmentStore.subscribe,
    investmentStore.getSnapshot,
    investmentStore.getSnapshot,
  )
}
