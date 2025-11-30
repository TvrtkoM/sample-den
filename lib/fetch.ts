import { SamplesPageQueryResult } from "@/groq-generated/sanity-types";
import { samplesPageQuery } from "@/groq/samples";
import { defaultSamplesPageSize } from "./constants";
import { sanityClient } from "./sanity-client";

export async function fetchSamplesPage(pageNumber: number) {
  const offset = (pageNumber - 1) * defaultSamplesPageSize;
  const end = offset + defaultSamplesPageSize;

  const result = await sanityClient.fetch<SamplesPageQueryResult, { offset: number; end: number }>(samplesPageQuery, { offset, end });

  return result;
}