import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

/** Неоморфное поле ввода (вдавленная поверхность). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'neo-pressed neo-focus w-full rounded-xl px-4 py-2.5 text-sm',
        'text-[var(--text-strong)] placeholder:text-[var(--muted)]',
        'outline-none',
        className,
      )}
      {...props}
    />
  )
})
