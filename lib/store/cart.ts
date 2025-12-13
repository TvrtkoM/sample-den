import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const cartDrawerOpenAtom = atom(false);

export const useCartDrawerOpenAtom = () => {
  return useAtom(cartDrawerOpenAtom);
}

export const useOpenCartDrawer = () => {
  const setOpen = useSetAtom(cartDrawerOpenAtom);
  return () => setOpen(true);
}

export const useCloseCartDrawer = () => {
  const setOpen = useSetAtom(cartDrawerOpenAtom);
  return () => setOpen(false);
}

export const useIsCartDrawerOpen = () => {
  return useAtomValue(cartDrawerOpenAtom);
}