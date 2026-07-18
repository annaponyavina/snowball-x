import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { AppLayout } from './ui/AppLayout'
import { DashboardPage } from '@/pages/dashboard'
import { CalendarPage } from '@/pages/calendar'
import { InvestmentsPage } from '@/pages/investments'
import { GoalPage } from '@/pages/goal'

export const router = createBrowserRouter([
  {
    path: ROUTES.dashboard,
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.calendar, element: <CalendarPage /> },
      { path: ROUTES.investments, element: <InvestmentsPage /> },
      { path: ROUTES.goal, element: <GoalPage /> },
    ],
  },
],
{
  basename: import.meta.env.BASE_URL,
})
