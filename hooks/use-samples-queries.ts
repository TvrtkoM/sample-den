import { fetchSamplesPage } from "@/lib/fetch";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useSuspenseSamplesPage(pageNumber = 1, search = "") {
  return useSuspenseQuery({
    queryKey: ['samples', search, pageNumber],
    queryFn: async () => {
      return fetchSamplesPage(pageNumber, search);
    },
    staleTime: 60 * 1000 * 60
  })
}