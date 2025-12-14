import { fetchSamplesPage } from "@/lib/fetch/samples";
import { useSuspenseQuery } from "@tanstack/react-query";

const samplePageStaleTime = 60 * 1000 * 60;

export function useSuspenseSamplesPage(pageNumber = 1, search = "") {
  return useSuspenseQuery({
    queryKey: ['samples', search, pageNumber],
    queryFn: async () => {
      return fetchSamplesPage(pageNumber, search);
    },
    staleTime: samplePageStaleTime,
  })
}