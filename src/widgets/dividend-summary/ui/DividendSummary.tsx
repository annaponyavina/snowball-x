import { useTranslation } from 'react-i18next'
import type { DividendEvent } from '@/entities/dividend'
import { getYearTotal, getMonthlyAverage, getDailyAverage } from '@/entities/dividend'
import { Card, InfoTooltip } from '@/shared/ui'
import { formatMoney, formatPercent } from '@/shared/lib/format'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--text-strong)]">{value}</span>
    </div>
  )
}

/** Сводка по выплатам за год: всего, в месяц, в день, доходность. */
export function DividendSummary({
  events,
  yieldPct,
}: {
  events: DividendEvent[]
  yieldPct: number
}) {
  const { t } = useTranslation()

  return (
    <Card className="flex flex-col gap-4">
      <div className="text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm text-[var(--muted)]">
          {t('calendar.yearTotal')}
          <InfoTooltip text={t('calendar.yearTotalHint')} />
        </p>
        <p className="mt-1 text-3xl font-semibold text-[var(--text-strong)]">
          {formatMoney(getYearTotal(events))}
        </p>
      </div>
      <div className="neo-pressed rounded-xl px-4 py-2">
        <Row label={t('calendar.perMonth')} value={formatMoney(getMonthlyAverage(events))} />
        <Row label={t('calendar.perDay')} value={formatMoney(getDailyAverage(events))} />
        <Row label={t('calendar.yield')} value={formatPercent(yieldPct)} />
      </div>
    </Card>
  )
}
