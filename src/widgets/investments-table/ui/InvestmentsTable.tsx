import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Investment } from '@/entities/investment'
import { investmentStore } from '@/entities/investment'
import { Card, IconButton } from '@/shared/ui'
import { formatMoney, formatDate } from '@/shared/lib/format'

const TrashIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Таблица вложенных средств с удалением строк. */
export function InvestmentsTable({ investments }: { investments: Investment[] }) {
  const { t } = useTranslation()

  const rows = useMemo(
    () => [...investments].sort((a, b) => b.date.localeCompare(a.date)),
    [investments],
  )

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t('investments.date')}
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t('investments.amount')}
              </th>
              <th className="w-16 px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--neo-dark)]/30">
                <td className="px-5 py-4 text-[var(--text)]">{formatDate(row.date)}</td>
                <td className="px-5 py-4 text-right font-medium text-[var(--text-strong)]">
                  {formatMoney(row.amount)}
                </td>
                <td className="px-5 py-4 text-right">
                  <IconButton
                    className="h-8 w-8 text-[var(--danger)]"
                    aria-label={t('investments.delete')}
                    title={t('investments.delete')}
                    onClick={() => investmentStore.remove(row.id)}
                  >
                    {TrashIcon}
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
