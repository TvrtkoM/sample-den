// safe to use on both server and client (except fetchSamplesForCheckoutByIds — server-only)
import {
  samplesByIdsQuery,
  samplesForCheckoutByIdsQuery,
  samplesPageQuery,
  samplesPriceSumByIdsQuery,
} from '@/groq/samples'
import { defaultSamplesPageSize } from '../constants'
import { sanityClient } from '../sanity-client'

/**
 * Fetches a paginated, optionally filtered page of samples from Sanity.
 *
 * @param pageNumber - 1-based page index.
 * @param search - Free-text filter applied against title, description, and categories.
 * @returns The query result containing `samples` and `totalCount`.
 */
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

/**
 * Fetches sample documents from Sanity for the given ids.
 * Returns an empty array immediately when `ids` is empty.
 *
 * @param ids - Sanity document ids of the samples to fetch.
 * @returns Array of sample documents.
 */
export async function fetchSamplesByIds(ids: string[]) {
  if (ids.length === 0) {
    return []
  }
  const res = await sanityClient.fetch(samplesByIdsQuery, { ids })

  return res.samples
}

/**
 * Returns the sum of `priceUsd` for the given sample ids, as stored in Sanity.
 * Returns `0` immediately when `ids` is empty.
 *
 * @param ids - Sanity document ids of the samples to sum.
 * @returns Total price in USD cents (as stored on the documents).
 */
export async function fetchSamplesPriceSumByIds(ids: string[]) {
  if (ids.length === 0) {
    return 0
  }
  const res = await sanityClient.fetch(samplesPriceSumByIdsQuery, { ids })

  return res.totalPrice
}

/**
 * Fetches minimal sample data needed for Stripe checkout, including the private
 * S3 key. **Server-only** — exposes `s3Key` and must never be called from client code.
 * Returns an empty array immediately when `ids` is empty.
 *
 * @param ids - Sanity document ids of the samples being checked out.
 * @returns Array of checkout-safe sample documents with `s3Key` and `fileName`.
 */
export async function fetchSamplesForCheckoutByIds(ids: string[]) {
  if (ids.length === 0) {
    return []
  }
  const res = await sanityClient.fetch(samplesForCheckoutByIdsQuery, { ids })

  return res.samples
}
