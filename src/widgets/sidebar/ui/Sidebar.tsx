import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { ThemeToggle } from '@/features/theme-toggle'
import { LanguageSwitch } from '@/features/language-switch'
import { IconButton } from '@/shared/ui'
import { NAV_ITEMS } from '../model/navItems'

const COLLAPSE_KEY = 'sidebar-collapsed'

/** Шеврон сворачивания: указывает влево, при свёрнутом меню разворачивается на 180°. */
const ChevronIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M15 5 8 12l7 7"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Левый сайдбар: бренд, навигация, переключатели темы и языка. Сворачивается до иконок. */
export function Sidebar() {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1'
    } catch {
      return false
    }
  })

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      } catch {
        // localStorage недоступен — сворачивание просто не сохранится
      }
      return next
    })
  }

  return (
    <aside
      className={cn(
        // На мобильных сайдбар скрыт — навигация уезжает в нижнюю панель (BottomNav).
        'hidden shrink-0 flex-col gap-8 py-5 transition-[width,padding] duration-300 ease-in-out md:flex',
        // Прилипает к вьюпорту на всю высоту экрана, чтобы нижний блок (тема, язык,
        // сворачивание) был всегда виден без прокрутки страницы вниз.
        'md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto',
        collapsed ? 'w-20 px-3' : 'w-64 px-5',
      )}
    >
      <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : 'px-2')}>
        <span className="neo-raised grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg">❄️</span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-[var(--text-strong)]">{t('app.name')}</p>
            <p className="truncate text-xs text-[var(--muted)]">{t('app.tagline')}</p>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? t(item.key) : undefined}
            className={({ isActive }) =>
              cn(
                'neo-focus flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition',
                collapsed ? 'justify-center px-0' : 'px-4',
                isActive
                  ? 'neo-pressed text-[var(--accent-strong)]'
                  : 'text-[var(--text)] hover:text-[var(--text-strong)]',
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{t(item.key)}</span>}
          </NavLink>
        ))}
      </nav>

      <div
        className={cn(
          'mt-auto flex gap-3',
          collapsed ? 'flex-col items-center' : 'items-center justify-between px-1',
        )}
      >
        {!collapsed && <LanguageSwitch />}
        <div className={cn('flex gap-2', collapsed ? 'flex-col items-center' : 'items-center')}>
          <ThemeToggle />
          <IconButton
            onClick={toggle}
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
            title={collapsed ? t('nav.expand') : t('nav.collapse')}
            aria-expanded={!collapsed}
          >
            <span className={cn('transition-transform duration-300', collapsed && 'rotate-180')}>
              {ChevronIcon}
            </span>
          </IconButton>
        </div>
      </div>
    </aside>
  )
}
