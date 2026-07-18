import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { SUPPORTED_LANGUAGES, setLanguage } from '@/shared/config/i18n'
import type { Language } from '@/shared/config/i18n'

/** Сегментированный переключатель языка интерфейса. */
export function LanguageSwitch() {
  const { i18n } = useTranslation()
  const current = i18n.language as Language

  return (
    <div className="neo-pressed flex gap-1 rounded-xl p-1" role="group" aria-label="Language">
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = current === lang
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={active}
            className={cn(
              'neo-focus rounded-lg px-2.5 py-1 text-xs font-semibold uppercase transition',
              active
                ? 'neo-raised-sm text-[var(--accent-strong)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]',
            )}
          >
            {lang}
          </button>
        )
      })}
    </div>
  )
}
