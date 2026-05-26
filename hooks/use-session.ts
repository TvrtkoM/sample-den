import { useSessionContext } from '@/context/SessionContext'
import { useSessionAuth } from '@/lib/auth-client'
import { useSyncExternalStore } from 'react'

let _isSessionHydrated = false

const isSessionHydrated = (isClient: boolean) => {
  if (!isClient) {
    return false
  }
  return _isSessionHydrated
}

const setIsSessionHydrated = () => {
  _isSessionHydrated = true
}

/**
 * Returns the current session, merging the SSR-provided initial value from
 * {@link SessionContext} with the live client-side session from better-auth.
 * During hydration (before the client session resolves) the SSR session is
 * returned to avoid flicker.
 *
 * @returns Object with `session`, `refetch`, and `isPending`.
 */
export function useSession() {
  const initialSession = useSessionContext()
  const { data: clientSession, isPending, isRefetching, refetch } = useSessionAuth()

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  if (isClient && !isPending && !isSessionHydrated(isClient)) {
    setIsSessionHydrated()
  }

  if (isSessionHydrated(isClient)) {
    return { session: clientSession, refetch, isPending, isRefetching }
  }

  return { session: initialSession, refetch: undefined, isPending: true, isRefetching: true }
}
