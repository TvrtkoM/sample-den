import { fetchSamplesPage } from '@/lib/fetch/samples'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * Fetches a page of samples from Sanity, optionally filtered by a search term.
 * Results are cached for 1 hour; stale data is kept visible during re-fetches.
 *
 * @param pageNumber - 1-based page index.
 * @param search - Free-text filter string.
 * @defaultValue pageNumber `1`
 * @defaultValue search `""`
 */
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
