import 'client-only'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { parseAsBoolean, useQueryState } from 'nuqs'

const cartPageNumAtom = atom(1)

/** Returns the current page number shown in the cart drawer. */
export const useCartPageNum = () => {
  return useAtomValue(cartPageNumAtom)
}

/** Returns a setter for the cart drawer's current page number. */
export const useSetCartPageNum = () => {
  return useSetAtom(cartPageNumAtom)
}

const cartVisibleAtom = atomWithStorage('showCart', false, undefined, { getOnInit: true })

/** Returns `true` when the cart drawer is currently visible. */
export const useCartVisible = () => {
  const [cartOpenQueryParam] = useQueryState('cartOpen', parseAsBoolean)
  const cartOpenFromStorage = useAtomValue(cartVisibleAtom)
  return cartOpenQueryParam ?? cartOpenFromStorage
}

/** Returns a callback that closes the cart drawer. */
export const useHideCart = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  const [, setCartOpenQueryParam] = useQueryState('cartOpen', parseAsBoolean)
  return () => {
    setCartVisible(false)
    setCartOpenQueryParam(null)
  }
}

/** Returns a callback that opens the cart drawer. */
export const useShowCart = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  const [, setCartOpenQueryParam] = useQueryState('cartOpen', parseAsBoolean)
  return () => {
    setCartVisible(true)
    setCartOpenQueryParam(null)
  }
}
