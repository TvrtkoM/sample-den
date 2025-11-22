import { SampleBySlugDocument, SampleBySlugQuery, SampleBySlugQueryVariables } from "@/graphql-generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { useQuery } from "@tanstack/react-query";

export function useSampleBySlug(slug: string) {
  return useQuery<SampleBySlugQuery>({
    queryKey: ['sample'],
    queryFn: async () => {
      return graphqlClient.request<SampleBySlugQuery, SampleBySlugQueryVariables>(SampleBySlugDocument, { slug })
    }
  })
}