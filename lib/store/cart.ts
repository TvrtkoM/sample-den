import 'client-only'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const cartPageNumAtom = atom(1)

export const useCartPageNum = () => {
  return useAtomValue(cartPageNumAtom)
}

export const useSetCartPageNum = () => {
  return useSetAtom(cartPageNumAtom)
}

const cartVisibleAtom = atomWithStorage('showCart', false, undefined, { getOnInit: true })

export const useCartVisible = () => {
  return useAtomValue(cartVisibleAtom)
}

export const useHideCart = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  return () => setCartVisible(false)
}

export const useShowCart = () => {
  const setCartVisible = useSetAtom(cartVisibleAtom)
  return () => setCartVisible(true)
}
