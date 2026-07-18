import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GrowthPoint } from '@/entities/goal'
import { formatMoney, formatMoneyCompact } from '@/shared/lib/format'

interface Props {
  points: GrowthPoint[]
  target: number
  months: number
}

/** Прорядить точки, чтобы график оставался лёгким на длинных сроках. */
function sample(points: GrowthPoint[], max = 160): GrowthPoint[] {
  if (points.length <= max) return points
  const step = Math.ceil(points.length / max)
  const out = points.filter((_, i) => i % step === 0)
  const last = points[points.length - 1]
  if (out[out.length - 1] !== last) out.push(last)
  return out
}

export function GrowthChart({ points, target, months }: Props) {
  const { t } = useTranslation()
  const data = useMemo(() => sample(points), [points])
  const asYears = months > 24

  const tickLabel = (month: number) =>
    asYears ? String(Math.round(month / 12)) : String(month)

  const TooltipBox = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: GrowthPoint }>
  }) => {
    if (!active || !payload?.length) return null
    const p = payload[0].payload
    const years = Math.floor(p.month / 12)
    const rem = p.month % 12
    return (
      <div className="neo-raised rounded-lg px-3 py-2 text-sm">
        <p className="mb-1 font-medium text-[var(--text-strong)]">
          {years > 0 ? `${years} ${t('goal.yearsShort')} ` : ''}
          {rem} {t('goal.monthsShort')}
        </p>
        <p className="text-[var(--accent-strong)]">
          {t('goal.legendCapital')}: {formatMoney(p.value)}
        </p>
        <p className="text-[var(--muted)]">
          {t('goal.legendContributed')}: {formatMoney(p.contributed)}
        </p>
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="capitalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tickFormatter={tickLabel}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={(v: number) => formatMoneyCompact(v)}
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
          />
          <Tooltip content={<TooltipBox />} />
          {target > 0 && (
            <ReferenceLine
              y={target}
              stroke="var(--success)"
              strokeDasharray="5 5"
              label={{
                value: t('goal.legendTarget'),
                position: 'insideTopRight',
                fill: 'var(--success)',
                fontSize: 12,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#capitalFill)"
            name={t('goal.legendCapital')}
          />
          <Line
            type="monotone"
            dataKey="contributed"
            stroke="var(--muted)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name={t('goal.legendContributed')}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
