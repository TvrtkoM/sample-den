import { useSyncExternalStore } from 'react'

/**
 * Returns `true` after client-side hydration and `false` during SSR.
 * Implemented via `useSyncExternalStore` to avoid hydration mismatches.
 */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
