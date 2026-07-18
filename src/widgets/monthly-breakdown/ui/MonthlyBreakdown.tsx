import { useTranslation } from 'react-i18next'
import type { MonthBucket } from '@/entities/dividend'
import { Card } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { formatMoney, formatMonthYear, formatPercent } from '@/shared/lib/format'

/**
 * Помесячная разбивка купонного дохода: сумма ₽ и её доля в портфеле, %.
 * Отвечает на вопрос «в какой месяц сколько купонов я получаю».
 */
export function MonthlyBreakdown({ buckets }: { buckets: MonthBucket[] }) {
  const { t } = useTranslation()
  const maxTotal = Math.max(1, ...buckets.map((b) => b.total))

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-[var(--muted)]">
        {t('calendar.monthlyBreakdown')}
      </h2>
      <div className="flex flex-col">
        {buckets.map((b) => {
          const empty = b.total === 0
          return (
            <div
              key={`${b.year}-${b.month}`}
              className="flex items-center gap-3 py-2"
            >
              <span
                className={cn(
                  'w-28 shrink-0 text-sm capitalize',
                  empty ? 'text-[var(--muted)]' : 'text-[var(--text)]',
                )}
              >
                {formatMonthYear(b.year, b.month)}
              </span>
              <div className="neo-pressed h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${(b.total / maxTotal) * 100}%` }}
                />
              </div>
              <span
                className={cn(
                  'w-24 shrink-0 text-right text-sm font-semibold',
                  empty ? 'text-[var(--muted)]' : 'text-[var(--text-strong)]',
                )}
              >
                {formatMoney(b.total)}
              </span>
              <span className="w-16 shrink-0 text-right text-xs text-[var(--muted)]">
                {b.pct > 0 ? formatPercent(b.pct) : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
