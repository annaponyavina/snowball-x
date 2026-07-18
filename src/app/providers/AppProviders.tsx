import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { queryClient } from '@/shared/config/queryClient'
import i18n from '@/shared/config/i18n'
import { ThemeProvider } from './ThemeProvider'

/** Композиция глобальных провайдеров приложения. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
