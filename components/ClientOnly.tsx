'use client'
import { useIsClient } from '@/hooks/use-is-client'
import { ReactNode } from 'react'

/**
 * Renders its children only on the client after hydration.
 * Returns `null` during SSR and the initial server render to prevent
 * hydration mismatches for browser-only content.
 */
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return <>{isClient ? children : null}</>
}

export default ClientOnly
