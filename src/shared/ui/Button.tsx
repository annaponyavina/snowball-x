import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent'
}

/** Неоморфная кнопка: выпуклая, при нажатии вдавливается. */
export function Button({
  variant = 'default',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'neo-interactive neo-focus rounded-xl px-5 py-2.5 text-sm font-medium',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'accent' ? 'text-[var(--accent-strong)]' : 'text-[var(--text-strong)]',
        className,
      )}
      {...props}
    />
  )
}
