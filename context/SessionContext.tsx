import { Session } from '@/lib/types'
import { createContext, use, useContext } from 'react'

export const SessionContext = createContext<Promise<Session | null> | null>(null)

export function useSessionContext() {
  const sessionPromise = useContext(SessionContext)
  if (!sessionPromise) return null
  return use(sessionPromise)
}
