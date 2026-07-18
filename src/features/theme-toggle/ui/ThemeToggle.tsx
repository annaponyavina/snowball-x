import { useTranslation } from 'react-i18next'
import { IconButton } from '@/shared/ui'
import { useTheme } from '@/app/providers/ThemeProvider'

const SunIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const MoonIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

/** Переключатель светлой/тёмной темы. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const label = theme === 'light' ? t('theme.toDark') : t('theme.toLight')

  return (
    <IconButton onClick={toggleTheme} aria-label={label} title={label}>
      {theme === 'light' ? MoonIcon : SunIcon}
    </IconButton>
  )
}
