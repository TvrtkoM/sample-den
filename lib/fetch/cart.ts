import "client-only";

export async function fetchCart(): Promise<{ items: string[] }> {
  const res = await fetch('/api/cart')
  if (!res.ok) throw new Error('Failed to fetch cart')
  return res.json()
}

export async function addToCart(sampleId: string) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId }),
  })
  if (!res.ok) throw new Error('Failed to add to cart')
  return res.json()
}

export async function removeFromCart(sampleId: string) {
  const res = await fetch('/api/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId }),
  })
  if (!res.ok) throw new Error('Failed to remove from cart')
  return res.json()
}