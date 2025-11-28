import { SamplesPageDocument } from "@/graphql-generated/graphql";
import { defaultSamplesPageSize } from "@/lib/constants";
import { graphqlClient } from "@/lib/graphql-client";
import { useQuery } from "@tanstack/react-query";

export function useSamples(pageNumber = 1) {
  return useQuery({
    queryKey: ['samples', pageNumber],
    queryFn: async () => {
      return graphqlClient.request(
        SamplesPageDocument,
        {
          limit: defaultSamplesPageSize,
          offset: defaultSamplesPageSize * (pageNumber - 1)
        })
    }
  })
}