'use client'
import { usePathname } from 'next/navigation'
import UserDropdown from './auth/UserDropdown'
import CartIcon from './cart/CartIcon'
import { NavButton } from './ui/nav-button'

const AppNavButtons = () => {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-2">
      <div className="flex mr-4">
        <NavButton href="/samples" variant="outline" active={pathname === '/samples'}>
          Store
        </NavButton>
      </div>
      <UserDropdown />
      <CartIcon />
    </nav>
  )
}

export default AppNavButtons
