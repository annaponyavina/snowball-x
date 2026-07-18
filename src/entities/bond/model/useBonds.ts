import { useQuery } from '@tanstack/react-query'
import { portfolioApi } from '@/shared/api'
import type { PortfolioSnapshot } from '@/shared/api'

/** Ключ запроса портфеля. */
export const PORTFOLIO_QUERY_KEY = ['portfolio'] as const

/** Загрузка снимка портфеля (облигации + денежный остаток) через контракт PortfolioApi. */
export function usePortfolio() {
  return useQuery<PortfolioSnapshot>({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: () => portfolioApi.getPortfolio(),
  })
}
