'use client'

import { usePathname } from 'next/navigation'
import { NavButton } from '../ui/nav-button'

const links = [
  { href: '/profile', label: 'Overview' },
  { href: '/profile/library', label: 'Library' },
  { href: '/profile/purchases', label: 'Purchases' },
] as const

/** Secondary navigation for the profile section with links to Overview and Library. */
export default function ProfileNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Profile" className="flex gap-2 mb-6">
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
