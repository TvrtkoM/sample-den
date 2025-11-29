import { SamplesPageDocument } from "@/graphql-generated/graphql";
import { defaultSamplesPageSize } from "./constants";
import { graphqlClient } from "./graphql-client";
import { sanityClient } from "./sanity-client";

export async function fetchSamplePage(pageNumber: number) {
  const pagePromise = graphqlClient.request(
    SamplesPageDocument,
    {
      limit: defaultSamplesPageSize,
      offset: defaultSamplesPageSize * (pageNumber - 1)
    }
  )
  const totalPromise = sanityClient.fetch<number>('count(*[_type == "sample"])')

  const [pageData, totalCount] = await Promise.all([pagePromise, totalPromise]);

  return {
    samples: pageData.allSample,
    totalCount
  }
}