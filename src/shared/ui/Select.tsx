import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

/** Неоморфный выпадающий список. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'neo-pressed neo-focus w-full appearance-none rounded-xl px-4 py-2.5 text-sm',
        'text-[var(--text-strong)] outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})
