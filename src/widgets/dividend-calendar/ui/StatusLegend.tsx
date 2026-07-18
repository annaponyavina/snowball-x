import { useTranslation } from 'react-i18next'
import { CATEGORY_ORDER, CATEGORY_COLOR } from '@/entities/dividend'

/** Легенда статусов выплат. */
export function StatusLegend() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {CATEGORY_ORDER.map((cat) => (
        <span key={cat} className="flex items-center gap-2 text-xs text-[var(--text)]">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: CATEGORY_COLOR[cat] }}
          />
          {t(`calendar.status.${cat}`)}
        </span>
      ))}
    </div>
  )
}
