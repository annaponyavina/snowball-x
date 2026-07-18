import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { portfolioApi } from '@/shared/api'
import { PORTFOLIO_QUERY_KEY } from '@/entities/bond'
import { Button, Spinner } from '@/shared/ui'

/**
 * Кнопка «Загрузить пример» (ТЗ §9): наполняет мок-портфель демо-данными
 * и инвалидирует запрос облигаций. Скрыта, если провайдер не поддерживает демо.
 */
export function LoadExampleButton() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => portfolioApi.loadExample!(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  })

  if (!portfolioApi.loadExample) return null

  return (
    <Button variant="accent" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      <span className="flex items-center gap-2">
        {mutation.isPending && <Spinner className="h-4 w-4" />}
        {t('common.loadExample')}
      </span>
    </Button>
  )
}
