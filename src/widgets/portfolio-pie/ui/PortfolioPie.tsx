import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Bond } from '@/entities/bond'
import { getBondValue, getPortfolioTotal } from '@/entities/bond'
import { Card } from '@/shared/ui'
import { formatMoney, formatPercent } from '@/shared/lib/format'

interface Slice {
  id: string
  name: string
  value: number
  share: number
  /** Цвет сектора (Recharts читает поле fill из данных). */
  fill: string
}

function SliceTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Slice }> }) {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload
  return (
    <div className="neo-raised rounded-lg px-3 py-2 text-sm">
      <p className="font-medium text-[var(--text-strong)]">{slice.name}</p>
      <p className="text-[var(--muted)]">
        {formatMoney(slice.value)} · {formatPercent(slice.share, 1)}
      </p>
    </div>
  )
}

/** Круговая диаграмма долей активов в портфеле. */
export function PortfolioPie({
  bonds,
  colorMap,
}: {
  bonds: Bond[]
  colorMap: Map<string, string>
}) {
  const { t } = useTranslation()

  const data = useMemo<Slice[]>(() => {
    const total = getPortfolioTotal(bonds)
    return bonds.map((b) => {
      const value = getBondValue(b)
      return {
        id: b.id,
        name: b.name,
        value,
        share: total === 0 ? 0 : (value / total) * 100,
        fill: colorMap.get(b.id) ?? 'var(--chart-1)',
      }
    })
  }, [bonds, colorMap])

  return (
    <Card className="flex flex-col">
      <h2 className="mb-2 text-sm font-semibold text-[var(--muted)]">
        {t('dashboard.distribution')}
      </h2>

      {/* Диаграмма занимает собственную высоту — легенда вынесена отдельно,
          поэтому пирог не обрезается сверху и текст на него не налезает. */}
      <div className="h-56 w-full shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="id"
              isAnimationActive={false}
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
            />
            <Tooltip content={<SliceTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {data.map((slice) => (
          <li key={slice.id} className="flex min-w-0 items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.fill }}
            />
            <span className="truncate text-xs text-[var(--text)]" title={slice.name}>
              {slice.name}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
