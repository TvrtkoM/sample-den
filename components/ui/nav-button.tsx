import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ReactNode } from 'react'

const navButtonVariants = cva('px-3 py-1.5 rounded-md text-base font-medium transition-colors', {
  variants: {
    variant: {
      default: '',
      outline: 'border shadow-xs',
    },
    size: {
      lg: 'text-lg',
      md: 'text-base',
    },
  },
  defaultVariants: {
    size: 'lg',
    variant: 'default',
  },
})

type NavButtonProps = {
  href: string
  active: boolean
  children: ReactNode
} & VariantProps<typeof navButtonVariants>

export function NavButton({ href, active, children, size, variant }: NavButtonProps) {
  return (
    <Link
      key={href}
      href={href}
      className={cn(
        'px-3 py-1.5 rounded-md text-base font-medium transition-colors',
        active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
        navButtonVariants({ size, variant }),
      )}
    >
      {children}
    </Link>
  )
}
