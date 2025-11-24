import { SamplesPageDocument } from "@/graphql-generated/graphql";
import { defaultSamplesPageSize } from "@/lib/constants";
import { graphqlClient } from "@/lib/graphql-client";
import { useQuery } from "@tanstack/react-query";

export function useSamples(pageIndex = 0) {
  return useQuery({
    queryKey: ['samples', pageIndex],
    queryFn: async () => {
      return graphqlClient.request(
        SamplesPageDocument,
        {
          limit: defaultSamplesPageSize,
          offset: defaultSamplesPageSize * pageIndex
        })
    }
  })
}