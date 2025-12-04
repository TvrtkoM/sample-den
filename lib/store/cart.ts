import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { unstable_ssrSafe as ssrSafe } from 'zustand/middleware'

type CartItem = {
  id: string;
};

type State = {
  items: Record<string, CartItem>,
  toggle: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<State>()(
  ssrSafe(
    immer((set) => {
      return {
        items: {},
        toggle: (id) => {
          set((state) => {
            if (id in state.items) {
              delete state.items[id];
            } else {
              state.items[id] = { id };
            }
          })
        },
        clear: () => {
          set((state) => {
            state.items = {}
          })
        },
      }
    })
  )
)

export const useCartSize = () => {
  return useCartStore((s) => {
    return Object.keys(s.items).length;
  })
}

export const useIsInCart = (id: string) => {
  return useCartStore((s) => {
    return id in s.items;
  })
}

export const useToggleCartItem = () => {
  return useCartStore((s => s.toggle));
}