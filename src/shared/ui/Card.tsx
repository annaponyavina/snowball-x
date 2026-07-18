import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Вдавленная поверхность вместо выпуклой. */
  inset?: boolean
}

/** Неоморфная карточка-контейнер. */
export function Card({ inset = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(inset ? 'neo-pressed' : 'neo-raised', 'rounded-2xl p-6', className)}
      {...props}
    />
  )
}
