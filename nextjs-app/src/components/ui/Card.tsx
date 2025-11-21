import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-xl p-6 border border-gray-100',
        hover && 'transform hover:scale-105 transition-all hover:shadow-2xl',
        className
      )}
    >
      {children}
    </div>
  )
}

