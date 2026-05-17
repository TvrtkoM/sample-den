'use client'

import { auth } from '@/lib/auth'
import { getQueryClient } from '@/lib/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactNode } from 'react'
import { SessionProvider } from './SessionProvider'

/**
 * Props for {@link AppProvider}.
 */
type AppProviderProps = {
  /** The application subtree to wrap with all providers. */
  children: ReactNode
  /** Streaming session promise passed down from the root layout RSC. */
  sessionPromise: Promise<typeof auth.$Infer.Session | null>
}

/**
 * Composes all client-side providers required by the application:
 * `SessionProvider`, `NuqsAdapter`, `JotaiProvider`, and `QueryClientProvider`.
 * Must wrap the root layout client tree.
 */
export default function AppProvider({ children, sessionPromise }: AppProviderProps) {
  const queryClient = getQueryClient()

  return (
    <SessionProvider sessionPromise={sessionPromise}>
      <NuqsAdapter>
        <JotaiProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </QueryClientProvider>
        </JotaiProvider>
      </NuqsAdapter>
    </SessionProvider>
  )
}
