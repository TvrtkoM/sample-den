import { defaultShouldDehydrateQuery, environmentManager, QueryClient } from '@tanstack/react-query'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | null = null

/**
 * Returns the shared React Query `QueryClient` instance.
 * On the server a fresh client is created per request; on the browser a single
 * instance is reused for the lifetime of the tab.
 */
export const getQueryClient = () => {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
