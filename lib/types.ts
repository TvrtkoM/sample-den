import { auth } from './auth'

export type Session = typeof auth.$Infer.Session

/**
 * Action state of a sample card's primary button.
 *
 * - `buy` — not owned and not in the cart.
 * - `in-cart` — not owned but currently in the cart.
 * - `download` — already purchased by the current user.
 */
export type SampleActionState = 'buy' | 'in-cart' | 'download'

/**
 * Map of sample id to its purchase id, for samples the current user has
 * purchased.
 *
 * @remarks
 * The map is sparse: a sample the user has not purchased is simply absent
 * (no key). A sample is "owned" if and only if its id is a key in this map,
 * so there are no `null` values to disambiguate.
 */
export type PurchasesMap = Record<string, string>
