import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
  
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1E40AF] shadow-xl hover:shadow-2xl',
    secondary: 'bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] shadow-lg',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xl',
    outline: 'border border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] shadow-lg',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

