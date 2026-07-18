import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePortfolio, getPortfolioYield, getPortfolioTotal } from '@/entities/bond'
import { buildDividendEvents, getMonthlyBuckets } from '@/entities/dividend'
import { PageHeader, EmptyState, Spinner } from '@/shared/ui'
import { DividendSummary } from '@/widgets/dividend-summary'
import { PaymentsChart } from '@/widgets/payments-chart'
import { MonthlyBreakdown } from '@/widgets/monthly-breakdown'
import { OfferDates } from '@/widgets/offer-dates'
import { DividendCalendar, StatusLegend } from '@/widgets/dividend-calendar'
import { LoadExampleButton } from '@/features/load-example-data'
import { RefreshButton } from '@/features/refresh-data'

/** Экран 2 — Календарь дивидендных выплат. */
export function CalendarPage() {
  const { t } = useTranslation()
  const { data, isLoading } = usePortfolio()
  const bonds = data?.bonds ?? []

  const events = useMemo(() => buildDividendEvents(bonds), [bonds])
  const yieldPct = getPortfolioYield(bonds)
  const hasData = events.length > 0

  // Якорь горизонта — месяц первой выплаты (данные идут «год вперёд»).
  const anchor = useMemo(() => {
    const first = events[0]?.date
    if (!first) {
      const now = new Date()
      return { year: now.getFullYear(), month: now.getMonth() + 1 }
    }
    const [y, m] = first.split('-')
    return { year: Number(y), month: Number(m) }
  }, [events])

  const portfolioValue = useMemo(() => getPortfolioTotal(bonds), [bonds])

  const buckets = useMemo(
    () => getMonthlyBuckets(events, anchor.year, anchor.month, portfolioValue),
    [events, anchor, portfolioValue],
  )

  return (
    <>
      <PageHeader
        title={t('nav.calendar')}
        subtitle={t('calendar.yearAhead')}
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
          <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr]">
            <DividendSummary events={events} yieldPct={yieldPct} />
            <PaymentsChart buckets={buckets} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyBreakdown buckets={buckets} />
            <OfferDates bonds={bonds} />
          </div>
          <StatusLegend />
          <DividendCalendar
            events={events}
            initialYear={anchor.year}
            initialMonth={anchor.month}
          />
        </div>
      )}
    </>
  )
}
