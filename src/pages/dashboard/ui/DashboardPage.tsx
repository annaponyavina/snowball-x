import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePortfolio, getAssetColorMap } from '@/entities/bond'
import { PageHeader, EmptyState, Spinner } from '@/shared/ui'
import { PortfolioSummary } from '@/widgets/portfolio-summary'
import { AssetsTable } from '@/widgets/assets-table'
import { PortfolioPie } from '@/widgets/portfolio-pie'
import { LoadExampleButton } from '@/features/load-example-data'
import { RefreshButton } from '@/features/refresh-data'

/** Экран 1 — Главное: баланс, доходность, таблица активов и диаграмма долей. */
export function DashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading } = usePortfolio()
  const bonds = data?.bonds ?? []
  const cashRub = data?.cashRub ?? 0

  const hasData = bonds.length > 0
  const colorMap = useMemo(() => getAssetColorMap(bonds), [bonds])

  return (
    <>
      <PageHeader
        title={t('nav.dashboard')}
        actions={
          <>
            <LoadExampleButton />
            {hasData && <RefreshButton />}
          </>
        }
      />

      {isLoading ? (
        <div className="grid place-items-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !hasData ? (
        <EmptyState
          title={t('common.empty')}
          hint={t('common.emptyHint')}
          action={<LoadExampleButton />}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <PortfolioSummary bonds={bonds} cashRub={cashRub} />
          <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr]">
            <PortfolioPie bonds={bonds} colorMap={colorMap} />
            <AssetsTable bonds={bonds} colorMap={colorMap} />
          </div>
        </div>
      )}
    </>
  )
}
