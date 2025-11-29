import { SamplesPageDocument } from "@/graphql-generated/graphql";
import { defaultSamplesPageSize } from "./constants";
import { graphqlClient } from "./graphql-client";
import { sanityClient } from "./sanity-client";

export async function fetchSamplesPage(pageNumber: number) {
  const gqlData = await graphqlClient.request(
    SamplesPageDocument,
    {
      limit: defaultSamplesPageSize,
      offset: defaultSamplesPageSize * (pageNumber - 1)
    }
  )

  return gqlData.allSample;
}

export async function fetchTotalSamplesCount() {
  return sanityClient.fetch<number>('count(*[_type == "sample"])');
}