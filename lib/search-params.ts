import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server'
import { Options, useQueryStates } from 'nuqs';

const samplesSearchParams = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault("")
};

export const loadSamplesSearchParams = createLoader(samplesSearchParams)

export const useSamplesSearchParams = (options?: Options) => useQueryStates(samplesSearchParams, options)