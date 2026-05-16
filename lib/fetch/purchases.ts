import 'client-only'
import type { PurchasesMap } from '../types'

export async function fetchPurchases(sampleIds: string[]): Promise<{ purchases: PurchasesMap }> {
  if (sampleIds.length === 0) {
    return { purchases: {} }
  }

  const res = await fetch('/api/purchases?ids=' + encodeURIComponent(sampleIds.join(',')))
  if (!res.ok) throw new Error('Failed to fetch purchases')
  return res.json()
}
