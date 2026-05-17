import { Session } from '@/lib/types'
import { createContext, use, useContext } from 'react'

/**
 * React context that holds a promise resolving to the current {@link Session} (or `null`).
 * The promise form allows server components to stream the session without blocking rendering.
 */
export const SessionContext = createContext<Promise<Session | null> | null>(null)

/**
 * Reads the current session from {@link SessionContext}.
 * Suspends until the session promise resolves.
 * Returns `null` when no context provider is present or when the user is not signed in.
 *
 * @returns The resolved {@link Session} or `null`.
 */
export function useSessionContext() {
  const sessionPromise = useContext(SessionContext)
  if (!sessionPromise) return null
  return use(sessionPromise)
}
