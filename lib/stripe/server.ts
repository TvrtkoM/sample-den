import 'server-only'

import Stripe from 'stripe'

/**
 * Pre-configured Stripe client for server-side payment operations.
 * Initialised with the secret key from env — never expose this on the client.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
