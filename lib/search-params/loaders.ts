import 'server-only'
import { createLoader } from 'nuqs/server'
import { samplesSearchParams } from './models'

/**
 * Server-side loader that parses the samples search params (`page`, `search`)
 * from an incoming request's URL. Used in RSC to pre-populate query state.
 */
export const loadSamplesSearchParams = createLoader(samplesSearchParams)
