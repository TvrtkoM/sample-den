// safe to use on both server and client
// - only fetching data
import { sampleDownloadByIdQuery, samplesByIdsQuery, samplesPageQuery, samplesPriceSumByIdsQuery } from '@/groq/samples'
import { defaultSamplesPageSize } from '../constants'
import { sanityClient } from '../sanity-client'

export async function fetchSamplesPage(pageNumber: number, search: string) {
  const offset = (pageNumber - 1) * defaultSamplesPageSize
  const end = offset + defaultSamplesPageSize

  const result = await sanityClient.fetch(samplesPageQuery, {
    offset,
    end,
    search,
  })

  return result
}

export async function fetchSamplesByIds(ids: string[]) {
  if (ids.length === 0) {
    return []
  }
  const res = await sanityClient.fetch(samplesByIdsQuery, { ids })

  return res.samples
}

export async function fetchSamplesPriceSumByIds(ids: string[]) {
  if (ids.length === 0) {
    return 0
  }
  const res = await sanityClient.fetch(samplesPriceSumByIdsQuery, { ids })

  return res.totalPrice
}

// shouldn't be used on client so s3Key is not exposed
export async function fetchSampleDownloadById(id: string) {
  return await sanityClient.fetch(sampleDownloadByIdQuery, { id })
}
