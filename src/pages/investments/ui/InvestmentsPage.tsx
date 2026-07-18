import { useTranslation } from 'react-i18next'
import { useInvestments, getTotalInvested } from '@/entities/investment'
import { PageHeader, Card, EmptyState } from '@/shared/ui'
import { formatMoney } from '@/shared/lib/format'
import { AddInvestmentForm } from '@/features/add-investment'
import { InvestmentsTable } from '@/widgets/investments-table'

/** Экран 3 — Вложенные средства (ручной учёт, localStorage). */
export function InvestmentsPage() {
  const { t } = useTranslation()
  const investments = useInvestments()
  const hasData = investments.length > 0

  return (
    <>
      <PageHeader title={t('nav.investments')} subtitle={t('investments.note')} />

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-[var(--muted)]">{t('investments.total')}</span>
          <span className="text-3xl font-semibold text-[var(--text-strong)]">
            {formatMoney(getTotalInvested(investments))}
          </span>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[var(--muted)]">
            {t('investments.addTitle')}
          </h2>
          <AddInvestmentForm />
        </Card>

        {hasData ? (
          <InvestmentsTable investments={investments} />
        ) : (
          <EmptyState title={t('investments.empty')} hint={t('investments.emptyHint')} />
        )}
      </div>
    </>
  )
}
