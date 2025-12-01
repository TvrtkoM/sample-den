import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type State = {
  items: Set<string>, // set of ids
  toggle: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<State>()(
  immer((set, get) => {
    return {
      items: new Set<string>(),
      toggle(id) {
        set((state) => {
          if (state.items.has(id)) {
            state.items.delete(id);
          } else {
            state.items.add(id);
          }
        })
      },
      clear() {
        set((state) => {
          state.items.clear()
        })
      },
    }
  })
)
