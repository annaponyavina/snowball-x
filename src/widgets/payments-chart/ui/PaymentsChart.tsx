import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthBucket, PaymentCategory } from '@/entities/dividend'
import { CATEGORY_ORDER, CATEGORY_COLOR } from '@/entities/dividend'
import { Card } from '@/shared/ui'
import {
  formatMoney,
  formatMoneyCompact,
  formatMonthShort,
  formatPercent,
} from '@/shared/lib/format'

interface Row extends MonthBucket {
  label: string
  /** Доминирующая категория месяца — задаёт цвет столбца. */
  dominant: PaymentCategory
}

function dominantCategory(bucket: MonthBucket): PaymentCategory {
  let best: PaymentCategory = 'forecast'
  let max = -1
  for (const cat of CATEGORY_ORDER) {
    if (bucket[cat] > max) {
      max = bucket[cat]
      best = cat
    }
  }
  return best
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: Row }>
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="neo-raised rounded-lg px-3 py-2 text-sm">
      <p className="font-medium text-[var(--text-strong)]">{row.label}</p>
      <p className="text-[var(--muted)]">
        {formatMoney(row.total)}
        {row.pct > 0 && <span className="ml-1">· {formatPercent(row.pct)}</span>}
      </p>
    </div>
  )
}

/** Столбчатый график выплат по месяцам (цвет столбца — доминирующая категория). */
export function PaymentsChart({ buckets }: { buckets: MonthBucket[] }) {
  const { t } = useTranslation()

  const data = useMemo<Row[]>(
    () =>
      buckets.map((b) => ({
        ...b,
        label: formatMonthShort(b.year, b.month),
        dominant: dominantCategory(b),
      })),
    [buckets],
  )

  return (
    <Card className="flex h-full flex-col">
      <h2 className="mb-2 text-sm font-semibold text-[var(--muted)]">
        {t('calendar.monthlyChart')}
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
            />
            <YAxis
              hide
              tickFormatter={(v: number) => formatMoneyCompact(v)}
            />
            <Tooltip cursor={{ fill: 'var(--accent-soft)' }} content={<ChartTooltip />} />
            <Bar dataKey="total" radius={[6, 6, 6, 6]} maxBarSize={26}>
              {data.map((row) => (
                <Cell key={`${row.year}-${row.month}`} fill={CATEGORY_COLOR[row.dominant]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
