'use client'
import { SessionContext } from '@/context/SessionContext'
import { Session } from '@/lib/types'
import { ReactNode } from 'react'

export function SessionProvider({
  children,
  sessionPromise,
}: {
  children: ReactNode
  sessionPromise: Promise<Session | null>
}) {
  return <SessionContext.Provider value={sessionPromise}>{children}</SessionContext.Provider>
}
