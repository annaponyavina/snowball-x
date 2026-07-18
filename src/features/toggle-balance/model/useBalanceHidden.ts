import { useSyncExternalStore } from 'react'
import { balanceStore } from './store'

/** Текущее состояние скрытия сумм (реактивно). */
export function useBalanceHidden(): boolean {
  return useSyncExternalStore(
    balanceStore.subscribe,
    balanceStore.getSnapshot,
    balanceStore.getSnapshot,
  )
}
