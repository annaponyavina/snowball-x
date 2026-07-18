import { API_SOURCE } from '@/shared/config/env'
import type { PortfolioApi } from './contract'
import { mockApi } from './mock/mockApi'
import { bcsApi } from './bcs/bcsApi'

/**
 * Фабрика провайдера данных: выбирает реализацию контракта по env-флагу.
 * Единственное место, где приложение «знает» про конкретный источник.
 */
export const portfolioApi: PortfolioApi = API_SOURCE === 'bcs' ? bcsApi : mockApi

export type { PortfolioApi } from './contract'
export type {
  Bond,
  CouponPayment,
  Currency,
  ApiSource,
  PaymentType,
  PortfolioSnapshot,
} from './types'
