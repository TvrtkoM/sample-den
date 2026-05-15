import { fetchSamplesPage } from '@/lib/fetch/samples'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useSamplesPage(pageNumber = 1, search = '') {
  return useQuery({
    queryKey: ['samples', search, pageNumber],
    queryFn: async () => {
      return fetchSamplesPage(pageNumber, search)
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60,
  })
}
