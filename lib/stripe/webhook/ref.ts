import 'server-only'

/**
 * Resolves a Stripe API reference that may be either an ID string or an
 * expanded object back to a single property (typically `'id'`).
 *
 * Stripe fields like `payment_intent` and `charge` are typed as
 * `string | Stripe.X | null` depending on whether the caller used `expand`.
 * This helper collapses that union into the field value without forcing
 * every call site to write the same `typeof === 'string' ? ... : ...` check.
 *
 * @param ref - The Stripe reference: an ID, an expanded object, or nullish.
 * @param key - The property to extract when `ref` is an expanded object.
 * @returns The resolved value, or `undefined` if `ref` is null/undefined.
 */
export function keyOf<T extends Record<K, string>, K extends keyof T>(
  ref: string | T | null | undefined,
  key: K,
): string | undefined {
  if (!ref) return undefined
  return typeof ref === 'string' ? ref : ref[key]
}
