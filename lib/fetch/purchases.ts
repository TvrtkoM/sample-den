import 'client-only'
import type { PurchasesMap } from '../types'

/**
 * Fetches purchase status for the given sample ids from the API.
 * Returns an empty purchases map immediately when `sampleIds` is empty.
 *
 * @param sampleIds - The Sanity document ids to check ownership for.
 * @returns Object with a {@link PurchasesMap} containing only the samples the current user owns.
 * @throws {Error} When the API response is not ok.
 */
export async function fetchPurchases(sampleIds: string[]): Promise<{ purchases: PurchasesMap }> {
  if (sampleIds.length === 0) {
    return { purchases: {} }
  }

  const res = await fetch('/api/purchases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: sampleIds }),
  })

  if (!res.ok) throw new Error('Failed to fetch purchases')

  return res.json()
}
