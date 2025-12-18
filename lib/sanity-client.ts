// safe to use on both client and server
// - doesn't contain any secret env varialble - used only for fetching
// - stateless
// - recreating multiple instances has no real cost
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-01",
  useCdn: true,
});