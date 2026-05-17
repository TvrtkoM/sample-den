import { defineQuery } from 'groq'

const sampleFragment = `
{
  _id,
  title,
  description,
  slug,
  highResFile {
    mp3Url
  },
  priceUsd,
  categories[]->{
    title,
    slug
  }
}
`

const samplesSearchFragment = `
*[_type == "sample" && (
    !defined($search) ||
    $search == "" ||
    title match $search ||
    description match $search ||
    categories[]->title match $search
)]
`

/**
 * GROQ query for the paginated samples listing page.
 * Accepts `$offset`, `$end`, and `$search` parameters.
 * Returns `{ samples, totalCount }`.
 */
export const samplesPageQuery = defineQuery(`
{
  "samples": ${samplesSearchFragment}
    | order(_createdAt desc)
    [$offset...$end]
    ${sampleFragment},
  "totalCount": count(${samplesSearchFragment})
}
`)

const samplesByIdsFragment = `
*[_type == "sample" && _id in $ids]
`

/**
 * GROQ query that fetches full sample documents for a given list of ids.
 * Accepts `$ids: string[]`. Returns `{ samples }`.
 */
export const samplesByIdsQuery = defineQuery(`
{
  "samples": ${samplesByIdsFragment}
    ${sampleFragment}
}
`)

/**
 * GROQ query that fetches minimal checkout data for a given list of ids.
 * Includes `s3Key` and `fileName` — **server-only**, must not be used on the client.
 * Accepts `$ids: string[]`. Returns `{ samples }`.
 */
export const samplesForCheckoutByIdsQuery = defineQuery(`
{
  "samples": ${samplesByIdsFragment}
  {
    _id,
    title,
    priceUsd,
    highResFile {
      s3Key,
      fileName
    }
  }
}
`)

/**
 * GROQ query that sums `priceUsd` for a given list of sample ids.
 * Accepts `$ids: string[]`. Returns `{ totalPrice }`.
 */
export const samplesPriceSumByIdsQuery = defineQuery(`
{
  "totalPrice": math::sum(${samplesByIdsFragment}.priceUsd)
}
`)
