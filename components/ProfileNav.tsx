'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/profile', label: 'Overview' },
  { href: '/profile/library', label: 'Library' },
] as const

export default function ProfileNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Profile" className="flex gap-1 mb-6">
      {links.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-3 py-1.5 rounded-md text-base font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
