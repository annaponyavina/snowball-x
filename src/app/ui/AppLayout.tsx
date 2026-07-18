import { Outlet } from 'react-router-dom'
import { Sidebar, BottomNav, MobileTopBar } from '@/widgets/sidebar'

/**
 * Каркас приложения. Десктоп: сайдбар слева + контент справа.
 * Мобильный: верхняя панель с брендом, контент, нижняя панель навигации.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <MobileTopBar />
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-28 pt-4 md:p-8 md:pb-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
