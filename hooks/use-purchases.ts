import { fetchPurchases } from '@/lib/fetch/purchases'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * Fetches which of the given samples the current user has purchased.
 * Ids are sorted before use as the query key to ensure cache stability regardless of input order.
 *
 * @param sampleIds - Sanity document ids of the samples to check ownership for.
 * @returns React Query result with `data.purchases` being a {@link PurchasesMap}.
 */
export function usePurchases(sampleIds: string[]) {
  const sortedIds = [...sampleIds].sort()

  return useQuery({
    queryKey: ['purchases', sortedIds],
    queryFn: () => fetchPurchases(sortedIds),
    placeholderData: keepPreviousData,
  })
}
