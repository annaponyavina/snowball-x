import type { DividendEvent } from '@/entities/dividend'
import { getCategory, CATEGORY_COLOR } from '@/entities/dividend'
import { formatMoney, formatPercent } from '@/shared/lib/format'

/** Карточка одной выплаты в ячейке дня. */
export function EventCard({ event }: { event: DividendEvent }) {
  const color = CATEGORY_COLOR[getCategory(event)]
  return (
    <div
      className="neo-raised-sm rounded-lg p-2"
      style={{ borderLeft: `3px solid ${color}` }}
      title={`${event.bondName} · ${formatMoney(event.amount, 'RUB')}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="neo-pressed grid h-5 shrink-0 place-items-center rounded px-1 text-[10px] font-bold text-[var(--text-strong)]">
          {event.short}
        </span>
        <span className="truncate text-xs text-[var(--text)]">{event.bondName}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-1">
        <span className="text-xs font-semibold text-[var(--text-strong)]">
          {formatMoney(event.amount)}
        </span>
        <span className="text-[10px] text-[var(--muted)]">
          {formatPercent(event.yieldPct, 2)}
        </span>
      </div>
    </div>
  )
}
