import { createClient } from '@sanity/client'

/**
 * Pre-configured Sanity client for GROQ queries.
 * Safe to use on both server and client — contains no secret credentials.
 * CDN delivery is enabled for optimal read performance.
 */
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-03-01',
  useCdn: true,
})
