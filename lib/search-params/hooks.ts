import 'client-only'
import { Options, useQueryStates } from 'nuqs'
import { samplesSearchParams } from './models'

/**
 * React hook that reads and writes the samples search params (`page`, `search`)
 * from/to the URL query string via nuqs.
 *
 * @param options - Optional nuqs configuration forwarded to `useQueryStates`.
 * @returns Tuple of `[params, setParams]` for the samples search state.
 */
export const useSamplesSearchParams = (options?: Options) => useQueryStates(samplesSearchParams, options)
