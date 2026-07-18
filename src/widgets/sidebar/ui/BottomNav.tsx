import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { NAV_ITEMS } from '../model/navItems'

/**
 * Нижняя панель навигации для мобильных (замена сайдбара).
 * Закреплена внизу экрана, показывается только на узких экранах (< md).
 */
export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      className="neo-raised fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around gap-1 rounded-t-2xl px-2 pt-2 md:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'neo-focus flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition',
              isActive
                ? 'neo-pressed text-[var(--accent-strong)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]',
            )
          }
        >
          <span className="shrink-0">{item.icon}</span>
          <span className="w-full truncate text-center">{t(item.shortKey ?? item.key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
