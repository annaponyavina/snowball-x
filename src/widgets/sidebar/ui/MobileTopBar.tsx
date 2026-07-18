import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@/features/theme-toggle'
import { LanguageSwitch } from '@/features/language-switch'

/**
 * Верхняя панель для мобильных: бренд слева, переключатели темы и языка справа.
 * Держит доступными настройки, которые на десктопе живут в сайдбаре. Только < md.
 */
export function MobileTopBar() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-[var(--neo-bg)]/90 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <span className="neo-raised grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base">
          ❄️
        </span>
        <span className="text-base font-semibold text-[var(--text-strong)]">{t('app.name')}</span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </header>
  )
}
