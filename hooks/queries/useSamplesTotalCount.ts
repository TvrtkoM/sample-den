import { fetchTotalSamplesCount } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

export default function useSamplesTotalCount() {
  return useQuery({
    queryKey: ['totalSamples'],
    queryFn: () => {
      return fetchTotalSamplesCount();
    }
  })
}