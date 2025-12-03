import { fetchSamplesPage } from "@/lib/fetch";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useSamplesPage(pageNumber = 1, search = "") {
  return useSuspenseQuery({
    queryKey: ['samples', search, pageNumber],
    queryFn: () => {
      return fetchSamplesPage(pageNumber, search);
    }
  })
}