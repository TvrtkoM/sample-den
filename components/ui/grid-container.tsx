import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function GridContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6', className)}>{children}</div>
  )
}
