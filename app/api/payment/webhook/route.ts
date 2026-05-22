import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe/server'
import { persistFailure } from '@/lib/stripe/webhook/errors'
import {
  handleChargeRefunded,
  handleCheckoutComplete,
  handleDisputeCreated,
  handleEarlyFraudWarning,
} from '@/lib/stripe/webhook/handlers'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Stripe webhook endpoint. Verifies the request signature, deduplicates
 * events via `ProcessedWebhookEvent`, then dispatches to the per-type
 * handler. Handlers are responsible for their own work and for marking
 * themselves processed; this function just routes and translates errors.
 *
 * Error-handling contract (see also the per-event handlers in
 * `lib/stripe/webhook/handlers.ts`):
 *
 * - **Signature missing / invalid**: 400. Never retry an unverifiable
 *   request — it was not sent by Stripe (or was tampered with).
 *
 * - **Endpoint secret not configured**: 500. The deployment is broken;
 *   Stripe should retry once configuration is fixed.
 *
 * - **P2002 (unique violation)**: 200. Two concurrent deliveries of the
 *   same event race on inserting the `ProcessedWebhookEvent` row. The
 *   first one wins and commits its work; the second sees a unique-key
 *   conflict and can safely be acknowledged as a no-op duplicate.
 *
 * - **Anything else uncaught**: 500. Treated as a *transient* failure
 *   (DB blip, network glitch, deadlock) — Stripe's retry will likely
 *   succeed. Handlers that know an error is *permanent* (missing data,
 *   `P2025` not-found, business-rule failure) ack with 200 internally
 *   so Stripe doesn't retry uselessly for 3 days; only unknown failures
 *   reach this outer catch, which also writes a `WebhookEventFailure`
 *   row via {@link persistFailure} for offline investigation.
 *
 * @param req - The incoming Stripe webhook request.
 * @returns A `NextResponse` whose status follows the contract above.
 */
export async function POST(req: Request) {
  if (!endpointSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }
  const reqHeaders = await headers()

  const signature = reqHeaders.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(await req.arrayBuffer()), signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const existingEvent = await prisma.processedWebhookEvent.findUnique({ where: { stripeEventId: event.id } })

    if (existingEvent) {
      console.log(`Event ${event.id} already processed, skipping`)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (event.type === 'charge.dispute.created') {
      await handleDisputeCreated(event)
    } else if (event.type === 'charge.refunded') {
      await handleChargeRefunded(event)
    } else if (event.type === 'radar.early_fraud_warning.created') {
      await handleEarlyFraudWarning(event)
    } else if (event.type === 'checkout.session.completed') {
      await handleCheckoutComplete(event)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    // P2002 = unique constraint violation, typically from concurrent delivery
    // of the same event. Safe to acknowledge — the first delivery committed.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ received: true }, { status: 200 })
    }
    console.error('Webhook processing error:', err)
    await persistFailure(event, err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
