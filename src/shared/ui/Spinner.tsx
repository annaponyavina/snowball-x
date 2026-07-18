import { cn } from '@/shared/lib/cn'

/** Индикатор загрузки. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent',
        'text-[var(--accent)]',
        className,
      )}
    />
  )
}
