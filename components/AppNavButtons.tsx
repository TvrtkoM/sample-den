import UserDropdown from './auth/UserDropdown'
import CartIcon from './cart/CartIcon'

const AppNavButtons = () => {
  return (
    <nav className="flex gap-1.5">
      <UserDropdown />
      <CartIcon />
    </nav>
  )
}

export default AppNavButtons
