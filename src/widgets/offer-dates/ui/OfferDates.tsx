import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Bond } from '@/shared/api'
import { Card } from '@/shared/ui'
import { formatDate } from '@/shared/lib/format'

interface Row {
  id: string
  short: string
  name: string
  nextCoupon?: string
  maturity: string
}

/**
 * Ближайшие оферты и погашения по облигациям портфеля.
 * Справочник БКС не отдаёт отдельного поля «оферта»: maturityDate — это
 * ближайшая эффективная дата (для бумаг с put-опционом это и есть оферта,
 * для остальных — погашение), поэтому колонку подписываем «оферта / погашение».
 */
export function OfferDates({ bonds }: { bonds: Bond[] }) {
  const { t } = useTranslation()

  const rows = useMemo<Row[]>(
    () =>
      bonds
        .filter((b): b is Bond & { maturityDate: string } => Boolean(b.maturityDate))
        .map((b) => ({
          id: b.id,
          short: b.short,
          name: b.name,
          nextCoupon: b.coupons[0]?.date,
          maturity: b.maturityDate,
        }))
        .sort((a, b) => a.maturity.localeCompare(b.maturity)),
    [bonds],
  )

  if (rows.length === 0) return null

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-[var(--muted)]">
          {t('calendar.offers.title')}
        </h2>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{t('calendar.offers.note')}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-[var(--muted)]">
              <th className="py-2 pr-3 font-semibold">{t('calendar.offers.bond')}</th>
              <th className="py-2 pr-3 font-semibold">{t('calendar.offers.nextCoupon')}</th>
              <th className="py-2 text-right font-semibold">{t('calendar.offers.maturity')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="align-middle">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="neo-pressed grid h-6 shrink-0 place-items-center rounded px-1.5 text-[10px] font-bold text-[var(--text-strong)]">
                      {r.short}
                    </span>
                    <span className="truncate text-[var(--text)]">{r.name}</span>
                  </div>
                </td>
                <td className="py-2 pr-3 text-[var(--muted)]">
                  {r.nextCoupon ? formatDate(r.nextCoupon) : '—'}
                </td>
                <td className="py-2 text-right font-semibold text-[var(--text-strong)]">
                  {formatDate(r.maturity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
