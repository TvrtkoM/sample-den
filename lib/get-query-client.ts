import {
  defaultShouldDehydrateQuery,
  environmentManager,
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

const makeQueryClient = () => {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _vars, _onMutateResult, mutation) => {
        if (typeof window !== 'undefined') {
          if (mutation.meta?.suppressToast) {
            return
          }
          toast.error(error.message || 'Something went wrong')
        }
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (typeof window !== 'undefined') {
          if (query.meta?.suppressToast) {
            return
          }
          toast.error(error.message || 'Something went wrong while loading data')
        }
      },
    }),
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
