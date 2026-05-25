import 'client-only'
import { HttpError } from './http-error'

/**
 * Fetches the current user's cart from the API.
 *
 * @returns Object containing the ordered array of sample ids in the cart.
 * @throws {Error} When the API response is not ok.
 */
export async function fetchCart(): Promise<{ items: string[] }> {
  const res = await fetch('/api/cart')
  if (!res.ok) throw new HttpError('Failed to fetch cart', res.status)
  return res.json()
}

/**
 * Adds a sample to the current user's cart.
 *
 * @param sampleId - The Sanity document id of the sample to add.
 * @throws {Error} When the API response is not ok.
 */
export async function addToCart(sampleId: string) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId }),
  })
  if (!res.ok) throw new HttpError('Failed to add to cart', res.status)
  return res.json()
}

/**
 * Removes a sample from the current user's cart.
 *
 * @param sampleId - The Sanity document id of the sample to remove.
 * @throws {Error} When the API response is not ok.
 */
export async function removeFromCart(sampleId: string) {
  const res = await fetch('/api/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId }),
  })
  if (!res.ok) throw new HttpError('Failed to remove from cart', res.status)
  return res.json()
}
