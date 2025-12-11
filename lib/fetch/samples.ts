import { samplesByIdsPageQuery, samplesPageQuery } from "@/groq/samples";
import { defaultSamplesPageSize } from "../constants";
import { sanityClient } from "../sanity-client";

export async function fetchSamplesPage(pageNumber: number, search: string) {
  const offset = (pageNumber - 1) * defaultSamplesPageSize;
  const end = offset + defaultSamplesPageSize;

  const result = await sanityClient.fetch(samplesPageQuery, { offset, end, search });

  return result;
}

export async function fetchSamplesByIds(ids: string[], pageNumber: number) {
  const offset = (pageNumber - 1) * defaultSamplesPageSize;
  const end = offset + defaultSamplesPageSize;

  const result = await sanityClient.fetch(samplesByIdsPageQuery, { ids, offset, end });

  return result;
}