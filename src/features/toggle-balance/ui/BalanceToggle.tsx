import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { balanceStore } from '../model/store'
import { useBalanceHidden } from '../model/useBalanceHidden'

const EyeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

const EyeOffIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.1 4M6.2 6.2A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.2-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Кнопка-глаз: скрывает/показывает денежные суммы. */
export function BalanceToggle({ className }: { className?: string }) {
  const { t } = useTranslation()
  const hidden = useBalanceHidden()
  const label = hidden ? t('dashboard.showBalance') : t('dashboard.hideBalance')

  return (
    <button
      type="button"
      onClick={() => balanceStore.toggle()}
      aria-label={label}
      aria-pressed={hidden}
      title={label}
      className={cn('neo-focus rounded-md p-1 text-[var(--muted)] hover:text-[var(--text)]', className)}
    >
      {hidden ? EyeOffIcon : EyeIcon}
    </button>
  )
}
