import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PORTFOLIO_QUERY_KEY } from '@/entities/bond'
import { IconButton } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'

/** Кнопка обновления данных по активам (рефетч запроса портфеля). */
export function RefreshButton() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isFetching = useIsFetching({ queryKey: PORTFOLIO_QUERY_KEY }) > 0

  return (
    <IconButton
      onClick={() => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY })}
      disabled={isFetching}
      aria-label={t('common.refresh')}
      title={t('common.refresh')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn(isFetching && 'animate-spin')}
      >
        <path
          d="M21 12a9 9 0 1 1-2.64-6.36M21 4v4h-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  )
}
