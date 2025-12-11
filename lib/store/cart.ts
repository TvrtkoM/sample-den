import { atom, useAtom, useSetAtom } from "jotai";

const cartDrawerOpenAtom = atom(false);

export const useCartDrawerOpen = () => {
  return useAtom(cartDrawerOpenAtom);
}

export const useOpenCartDrawer = () => {
  const setOpen = useSetAtom(cartDrawerOpenAtom);
  return () => setOpen(true);
}