'use client'
import { SessionContext } from '@/context/SessionContext'
import { Session } from '@/lib/types'
import { ReactNode } from 'react'

/**
 * Provides a streaming session promise to the React tree via {@link SessionContext}.
 * Wrap this around any subtree that needs access to the current {@link Session}.
 */
export function SessionProvider({
  children,
  sessionPromise,
}: {
  /** The application subtree to provide the session to. */
  children: ReactNode
  /** A promise that resolves to the current session, passed from a server component. */
  sessionPromise: Promise<Session | null>
}) {
  return <SessionContext.Provider value={sessionPromise}>{children}</SessionContext.Provider>
}
