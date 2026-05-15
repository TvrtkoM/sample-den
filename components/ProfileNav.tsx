'use client'

import { usePathname } from 'next/navigation'
import { NavButton } from './ui/nav-button'

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
          <NavButton key={href} active={isActive} href={href} size="md">
            {label}
          </NavButton>
        )
      })}
    </nav>
  )
}
