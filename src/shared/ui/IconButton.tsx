import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

/** Квадратная неоморфная кнопка-иконка (тема, компактные действия). */
export function IconButton({
  active,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      data-active={active}
      className={cn(
        'neo-interactive neo-focus grid h-11 w-11 place-items-center rounded-xl',
        'text-[var(--text)]',
        className,
      )}
      {...props}
    />
  )
}
