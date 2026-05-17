import { useSessionContext } from '@/context/SessionContext'
import { useSessionAuth } from '@/lib/auth-client'
import { useSyncExternalStore } from 'react'

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
  const { data: clientSession, isPending, refetch } = useSessionAuth()

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  if (!isHydrated || isPending) {
    return { session: initialSession, refetch: undefined, isPending: true }
  }

  return { session: clientSession, refetch, isPending }
}
