import { fetchSamplesPage } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

export default function useSamplesPage(pageNumber = 1) {
  return useQuery({
    queryKey: ['samples', pageNumber],
    queryFn: () => {
      return fetchSamplesPage(pageNumber)
    }
  })
}