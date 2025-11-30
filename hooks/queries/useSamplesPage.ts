import { fetchSamplesPage } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

export default function useSamplesPage(pageNumber = 1, search = "") {
  return useQuery({
    queryKey: ['samples', search, pageNumber],
    queryFn: () => {
      return fetchSamplesPage(pageNumber, search);
    }
  })
}