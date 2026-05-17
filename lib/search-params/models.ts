import { parseAsInteger, parseAsString } from 'nuqs/server'

/**
 * nuqs search-param definitions for the samples listing page.
 * Shared between the client hook and the server loader.
 *
 * - `page` — current page number, defaults to `1`.
 * - `search` — free-text filter string, defaults to `""`.
 */
export const samplesSearchParams = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
}
