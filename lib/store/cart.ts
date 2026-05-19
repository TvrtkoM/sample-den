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
  const cartOpenFromStorage = useAtomValue(cartVisibleAtom)
  return cartOpenFromStorage
}

/**
 * Returns a callback that sets the cart drawer's visibility.
 *
 * @returns A callback accepting `open` — `true` shows the cart drawer, `false` hides it.
 */
export const useSetCartVisible = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  return (open: boolean) => {
    setCartVisible(open)
  }
}
