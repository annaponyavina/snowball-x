import type { ReactNode } from 'react'
import { Card } from './Card'

interface EmptyStateProps {
  title: string
  hint?: string
  action?: ReactNode
}

/** Пустое состояние экрана (нет данных). */
export function EmptyState({ title, hint, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-lg font-medium text-[var(--text-strong)]">{title}</p>
      {hint && <p className="max-w-sm text-sm text-[var(--muted)]">{hint}</p>}
      {action}
    </Card>
  )
}
