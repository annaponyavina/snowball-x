import { z } from 'zod'
import type { PortfolioApi } from '../contract'
import type { PortfolioSnapshot } from '../types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/shared/lib/storage'
import { MOCK_BONDS } from './data'

/** Демонстрационный денежный остаток. */
const MOCK_CASH_RUB = 18_450

/** Имитация сетевой задержки, чтобы были видны состояния загрузки. */
function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Флаг «пример загружен» держим в localStorage, чтобы демо-данные
 * переживали перезагрузку страницы (по ТЗ данные показываются по кнопке).
 */
function isLoaded(): boolean {
  return readStorage(STORAGE_KEYS.mockLoaded, z.boolean(), false)
}

/**
 * Мок-реализация контракта портфеля.
 * Пока реальный БКС недоступен — приложение работает на этих данных.
 */
export const mockApi: PortfolioApi = {
  async getPortfolio(): Promise<PortfolioSnapshot> {
    await delay()
    if (!isLoaded()) return { bonds: [], cashRub: 0 }
    return { bonds: structuredClone(MOCK_BONDS), cashRub: MOCK_CASH_RUB }
  },

  async loadExample(): Promise<void> {
    await delay(700)
    writeStorage(STORAGE_KEYS.mockLoaded, true)
  },

  async reset(): Promise<void> {
    writeStorage(STORAGE_KEYS.mockLoaded, false)
  },
}
