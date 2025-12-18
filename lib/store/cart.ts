import "client-only";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { startTransition } from "react";

const cartDrawerOpenAtom = atom(false);

export const useOpenCartDrawer = () => {
  const setOpen = useSetAtom(cartDrawerOpenAtom);
  return () => {
    startTransition(() => {
      setOpen(true)
    })
  };
}

export const useCloseCartDrawer = () => {
  const setOpen = useSetAtom(cartDrawerOpenAtom);
  return () => {
    startTransition(() => {
      setOpen(false)
    })
  };
}

export const useIsCartDrawerOpen = () => {
  return useAtomValue(cartDrawerOpenAtom);
}

const cartPageNumAtom = atom(1);

export const useCartPageNum = () => {
  return useAtomValue(cartPageNumAtom);
}

export const useSetCartPageNum = () => {
  return useSetAtom(cartPageNumAtom);
}