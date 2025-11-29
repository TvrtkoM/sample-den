import { fetchSamplePage } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";


export function useSamples(pageNumber = 1) {
  return useQuery({
    queryKey: ['samples', pageNumber],
    queryFn: async () => {
      return fetchSamplePage(pageNumber)
    }
  })
}