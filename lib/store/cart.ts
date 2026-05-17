import 'client-only'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

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
  return useAtomValue(cartVisibleAtom)
}

/** Returns a callback that closes the cart drawer. */
export const useHideCart = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  return () => setCartVisible(false)
}

/** Returns a callback that opens the cart drawer. */
export const useShowCart = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  return () => setCartVisible(true)
}
