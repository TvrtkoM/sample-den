'use client'

import { getQueryClient } from '@/lib/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactNode } from 'react'

type AppProviderProps = {
  children: ReactNode
}

export default function AppProvider({ children }: AppProviderProps) {
  const queryClient = getQueryClient()

  return (
    <NuqsAdapter>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        </QueryClientProvider>
      </JotaiProvider>
    </NuqsAdapter>
  )
}
