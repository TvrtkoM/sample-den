'use client'
import { useIsClient } from '@/hooks/use-is-client'
import { ReactNode } from 'react'

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return <>{isClient ? children : null}</>
}

export default ClientOnly
