import "client-only";
import { atom, useAtomValue, useSetAtom } from "jotai";

const cartPageNumAtom = atom(1);

export const useCartPageNum = () => {
  return useAtomValue(cartPageNumAtom);
}

export const useSetCartPageNum = () => {
  return useSetAtom(cartPageNumAtom);
}