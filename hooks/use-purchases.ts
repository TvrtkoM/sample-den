import { fetchPurchases } from '@/lib/fetch/purchases'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function usePurchases(sampleIds: string[]) {
  const sortedIds = [...sampleIds].sort()

  return useQuery({
    queryKey: ['purchases', sortedIds],
    queryFn: () => fetchPurchases(sortedIds),
    placeholderData: keepPreviousData,
  })
}
