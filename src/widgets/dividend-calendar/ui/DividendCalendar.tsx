import { useMemo, useState } from 'react'
import type { DividendEvent } from '@/entities/dividend'
import { getEventsByDay, getMonthTotal } from '@/entities/dividend'
import { Card, IconButton } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { formatMoney, formatMonthYear, getWeekdayLabels } from '@/shared/lib/format'
import { EventCard } from './EventCard'

/** Смещение первого дня месяца при неделе, начинающейся с понедельника. */
function firstWeekdayOffset(year: number, month: number): number {
  return (new Date(year, month - 1, 1).getDay() + 6) % 7
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Календарь дивидендных выплат на месяц с навигацией. */
export function DividendCalendar({
  events,
  initialYear,
  initialMonth,
}: {
  events: DividendEvent[]
  initialYear: number
  initialMonth: number
}) {
  const [{ year, month }, setState] = useState({ year: initialYear, month: initialMonth })

  const step = (delta: number) =>
    setState(({ year, month }) => {
      const zero = month - 1 + delta
      return {
        year: year + Math.floor(zero / 12),
        month: ((zero % 12) + 12) % 12 + 1,
      }
    })

  const byDay = useMemo(() => getEventsByDay(events, year, month), [events, year, month])
  const monthTotal = useMemo(() => getMonthTotal(events, year, month), [events, year, month])

  const weekdays = getWeekdayLabels()
  const offset = firstWeekdayOffset(year, month)
  const total = daysInMonth(year, month)
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month

  const cells: Array<number | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ]

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => step(-1)} aria-label="prev" className="h-9 w-9">
            <Chevron dir="left" />
          </IconButton>
          <span className="min-w-40 text-center text-base font-semibold capitalize text-[var(--text-strong)]">
            {formatMonthYear(year, month)}
          </span>
          <IconButton onClick={() => step(1)} aria-label="next" className="h-9 w-9">
            <Chevron dir="right" />
          </IconButton>
        </div>
        {monthTotal > 0 && (
          <span className="neo-pressed rounded-lg px-3 py-1 text-sm font-semibold text-[var(--success)]">
            +{formatMoney(monthTotal)}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((w) => (
              <div
                key={w}
                className="px-1 pb-1 text-xs font-semibold uppercase text-[var(--muted)]"
              >
                {w}
              </div>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <div key={`e${i}`} className="min-h-24" />
              const dayEvents = byDay[day] ?? []
              const dayTotal = dayEvents.reduce((s, e) => s + e.amount, 0)
              const isToday = isCurrentMonth && today.getDate() === day
              return (
                <div
                  key={day}
                  className={cn(
                    'flex min-h-24 flex-col gap-1.5 rounded-xl p-2',
                    dayEvents.length > 0 && 'neo-pressed',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'grid h-6 w-6 place-items-center rounded-full text-xs',
                        isToday
                          ? 'bg-[var(--accent)] font-semibold text-white'
                          : 'text-[var(--muted)]',
                      )}
                    >
                      {day}
                    </span>
                    {dayTotal > 0 && (
                      <span className="text-[11px] font-semibold text-[var(--success)]">
                        +{formatMoney(dayTotal)}
                      </span>
                    )}
                  </div>
                  {dayEvents.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
