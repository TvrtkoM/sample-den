'use client'

import { auth } from '@/lib/auth'
import { getQueryClient } from '@/lib/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'jotai'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactNode } from 'react'
import { SessionContext } from '../context/SessionContext'

type AppProviderProps = {
  children: ReactNode
  sessionPromise: Promise<typeof auth.$Infer.Session | null>
}

export default function AppProvider({ children, sessionPromise }: AppProviderProps) {
  const queryClient = getQueryClient()

  return (
    <SessionContext.Provider value={sessionPromise}>
      <NuqsAdapter>
        <Provider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </QueryClientProvider>
        </Provider>
      </NuqsAdapter>
    </SessionContext.Provider>
  )
}
