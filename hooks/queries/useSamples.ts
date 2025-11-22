import { AllSamplesDocument, AllSamplesQuery } from "@/graphql-generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { useQuery } from "@tanstack/react-query";

export function useSamples() {
  return useQuery<AllSamplesQuery>({
    queryKey: ['samples'],
    queryFn: async () => {
      return graphqlClient.request(AllSamplesDocument)
    }
  })
}