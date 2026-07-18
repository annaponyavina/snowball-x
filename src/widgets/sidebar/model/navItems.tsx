import type { ReactNode } from 'react'
import { ROUTES } from '@/shared/config/routes'

export interface NavItem {
  to: string
  key: string
  /** Короткая подпись для нижней панели (моб.). Fallback — `key`. */
  shortKey?: string
  icon: ReactNode
  end?: boolean
}

const icon = (path: ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {path}
  </svg>
)

const s = {
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Пункты основной навигации. Общие для сайдбара (десктоп) и нижней панели (моб.). */
export const NAV_ITEMS: NavItem[] = [
  {
    to: ROUTES.dashboard,
    key: 'nav.dashboard',
    end: true,
    icon: icon(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" {...s} />
        <rect x="14" y="3" width="7" height="7" rx="1.5" {...s} />
        <rect x="14" y="14" width="7" height="7" rx="1.5" {...s} />
        <rect x="3" y="14" width="7" height="7" rx="1.5" {...s} />
      </>,
    ),
  },
  {
    to: ROUTES.calendar,
    key: 'nav.calendar',
    shortKey: 'nav.calendarShort',
    icon: icon(
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" {...s} />
        <path d="M3 9h18M8 2v4M16 2v4" {...s} />
      </>,
    ),
  },
  {
    to: ROUTES.investments,
    key: 'nav.investments',
    shortKey: 'nav.investmentsShort',
    icon: icon(
      <>
        <path d="M3 7c0-1.1 4-2 9-2s9 .9 9 2-4 2-9 2-9-.9-9-2Z" {...s} />
        <path d="M3 7v10c0 1.1 4 2 9 2s9-.9 9-2V7" {...s} />
        <path d="M3 12c0 1.1 4 2 9 2s9-.9 9-2" {...s} />
      </>,
    ),
  },
  {
    to: ROUTES.goal,
    key: 'nav.goal',
    shortKey: 'nav.goalShort',
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" {...s} />
        <circle cx="12" cy="12" r="5" {...s} />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>,
    ),
  },
]
