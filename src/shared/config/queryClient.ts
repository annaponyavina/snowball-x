import { QueryClient } from '@tanstack/react-query'

/** Единый клиент TanStack Query для всего приложения. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
