import 'server-only'

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe/server'
import Stripe from 'stripe'
import { keyOf } from './ref'

/**
 * Fetches every line item on a Stripe Checkout Session, transparently paging
 * through the API. Expands `price.product` so each item carries the original
 * product metadata (sampleId, s3Key, fileName) needed to record purchases.
 *
 * Stripe caps a single `listLineItems` response at 100 entries — without
 * paging, a cart with more than 100 distinct samples would silently truncate.
 *
 * @param sessionId - The Stripe Checkout Session ID to enumerate.
 * @returns All line items for the session, in Stripe's pagination order.
 */
async function getAllLineItems(sessionId: string) {
  const lineItems: Stripe.LineItem[] = []
  let hasMore = true
  let startingAfter: string | undefined

  while (hasMore) {
    const response = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.price.product'],
    })

    lineItems.push(...response.data)
    hasMore = response.has_more

    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  return lineItems
}

/**
 * Inserts an idempotency marker so the same Stripe event is never processed
 * twice. Accepts either the global Prisma client or a transaction client so
 * callers can write the marker in the same transaction as their side effects,
 * keeping "work done" and "event marked processed" atomically consistent.
 *
 * The caller is responsible for catching the resulting `P2002` (unique
 * violation) when two concurrent deliveries of the same event race — the
 * outer handler in the route translates that into a 200 ack.
 *
 * @param client - A Prisma client or transaction client.
 * @param eventId - The Stripe event ID (`event.id`) to mark as processed.
 */
async function recordEventProcessed(client: Prisma.TransactionClient, eventId: string) {
  return client.processedWebhookEvent.create({
    data: { stripeEventId: eventId },
  })
}

/**
 * Records a successful checkout as a Purchase (with PurchaseItems) and clears
 * the matching cart items, all in one transaction together with the
 * idempotency marker. This is the only place a Purchase row is ever created.
 *
 * Subtleties that aren't obvious from the code:
 *
 * - `session.payment_status` may not be `'paid'` even when this event fires:
 *   async payment methods (e.g. ACH) emit the event up-front and confirm
 *   later via `checkout.session.async_payment_succeeded`. The early return
 *   guards against fulfilling an unpaid order. The endpoint is currently
 *   card-only so this is mostly defensive.
 *
 * - Missing metadata is treated as a *permanent* failure: the event is marked
 *   processed and the function returns without creating a Purchase. Stripe
 *   retries would never recover (the metadata is set at session creation,
 *   not retry time), so retrying would just spam the endpoint. A human
 *   needs to investigate the missing fields.
 *
 * - The marker, Purchase write, and cart cleanup share a single transaction.
 *   If any step fails, none commit — preserving the invariant that "event
 *   processed" implies "purchase recorded and cart cleared." A concurrent
 *   redelivery of the same event hits the unique constraint on
 *   `ProcessedWebhookEvent.stripeEventId` and surfaces as `P2002`, which
 *   the route's outer catch acknowledges.
 *
 * @param event - The verified `checkout.session.completed` event from Stripe.
 */
export async function handleCheckoutComplete(event: Stripe.CheckoutSessionCompletedEvent) {
  const session = event.data.object

  if (session.payment_status !== 'paid') {
    return
  }

  const meta = session.metadata

  if (!meta?.userId || !meta?.checkoutIp || !meta?.checkoutUserAgent) {
    console.error('Missing required metadata in checkout session:', session.id)
    await recordEventProcessed(prisma, event.id)
    return
  }

  const lineItems = await getAllLineItems(session.id)

  const purchases = lineItems.map((item) => {
    const product = item.price?.product as Stripe.Product
    return {
      sampleId: product.metadata.sampleId,
      s3Key: product.metadata.s3Key,
      filename: product.metadata.fileName,
      priceInCents: item.amount_total,
    }
  })

  const sampleIds = purchases.map((p) => p.sampleId)

  const userId = meta.userId
  const checkoutIp = meta.checkoutIp
  const checkoutUserAgent = meta.checkoutUserAgent

  await prisma.$transaction(async (tx) => {
    await recordEventProcessed(tx, event.id)
    await tx.purchase.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: keyOf(session.payment_intent, 'id'),
        checkoutIp,
        checkoutUserAgent,
        items: { create: purchases },
      },
    })
    await tx.cartItem.deleteMany({ where: { userId, sampleId: { in: sampleIds } } })
  })

  console.log(`Checkout completed for user ${userId}, cleared ${sampleIds.length} cart items`)
}

/**
 * Reacts to a chargeback by marking the matching Purchase as DISPUTED and
 * revoking download access. The status change and idempotency marker are
 * written in a single transaction so the system never ends up "marked
 * processed but not revoked" or vice versa.
 *
 * The Dispute event references a `payment_intent` (not a checkout session),
 * which is why every Purchase carries `stripePaymentIntentId` — this is the
 * only bridge from a chargeback back to your own purchase record.
 *
 * Edge case to be aware of: if the Purchase row doesn't exist
 * (`P2025` — record not found), this is treated as a *permanent* failure.
 * Retrying won't conjure the missing row, so the event is acknowledged and
 * logged for human investigation rather than letting Stripe retry for 3 days.
 *
 * @param event - The verified `charge.dispute.created` event from Stripe.
 * @throws Re-throws any non-`P2025` Prisma error so the route's outer catch
 * can either acknowledge a `P2002` race or return 500 for genuine transient
 * failures.
 */
export async function handleDisputeCreated(event: Stripe.ChargeDisputeCreatedEvent) {
  const { object } = event.data
  const paymentIntentId = keyOf(object.payment_intent, 'id')

  if (!paymentIntentId) {
    console.log('no payment intent on dispute:', object.id)
    await recordEventProcessed(prisma, event.id)
    return
  }

  try {
    await prisma.$transaction(async (tx) => {
      await recordEventProcessed(tx, event.id)
      await tx.purchase.update({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: 'DISPUTED', revokedAt: new Date() },
      })
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      console.error('Dispute for unknown purchase:', paymentIntentId)
      // Don't return 500 — Stripe will retry forever. Acknowledge and investigate.
      await recordEventProcessed(prisma, event.id)
      return
    }
    throw err
  }
}

/**
 * Marks the matching Purchase as REFUNDED on a *full* refund. Partial refunds
 * (`amount_refunded < amount`) are acknowledged but do not revoke access — a
 * customer who got back $5 on a $50 purchase still owns the sample.
 *
 * The event might originate from a manual refund issued via the Stripe
 * dashboard, an API call, or the {@link handleEarlyFraudWarning} handler in
 * this same file. In the EFW case the Purchase is already `REVOKED` by the
 * time this fires; the `update` still finds the row by `stripePaymentIntentId`
 * (status is not in the where clause) and overwrites `REVOKED` with
 * `REFUNDED`, which is the final desired state.
 *
 * `P2025` (purchase not found) is handled the same way as in
 * {@link handleDisputeCreated}: ack and log, don't let Stripe retry forever.
 *
 * @param event - The verified `charge.refunded` event from Stripe.
 * @throws Re-throws any non-`P2025` Prisma error so the route's outer catch
 * can handle concurrent-delivery races (`P2002`) or surface transient
 * failures as 500.
 */
export async function handleChargeRefunded(event: Stripe.ChargeRefundedEvent) {
  const { object } = event.data
  const paymentIntentId = keyOf(object.payment_intent, 'id')

  if (!paymentIntentId) {
    console.log('no payment intent on refund: ', object.id)
    await recordEventProcessed(prisma, event.id)
    return
  }

  if (object.amount_refunded < object.amount) {
    console.log('Partial refund, not revoking:', object.id)
    await recordEventProcessed(prisma, event.id)
    return
  }

  try {
    await prisma.$transaction(async (tx) => {
      await recordEventProcessed(tx, event.id)
      await tx.purchase.update({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: 'REFUNDED', revokedAt: new Date() },
      })
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      console.error('Refund for unknown purchase:', paymentIntentId)
      // Don't return 500 — Stripe will retry forever. Acknowledge and investigate.
      await recordEventProcessed(prisma, event.id)
      return
    }
    throw err
  }
}

/**
 * Reacts to an Early Fraud Warning — the issuing bank flagging a charge as
 * likely fraud before a formal dispute is filed. Revokes access on any
 * matching ACTIVE Purchase and proactively refunds the charge to head off
 * the dispute (which reduces Stripe's dispute fee and avoids counting
 * against the merchant's dispute rate).
 *
 * Two non-obvious behaviors:
 *
 * 1. **Refund even when no Purchase row matches.** The atomic `updateMany`
 *    on `(stripePaymentIntentId, status: 'ACTIVE')` may return `count === 0`
 *    if the purchase is missing or already in a non-active state. The handler
 *    still issues the refund — the charge exists in Stripe regardless of
 *    what our DB knows about it, and leaving the fraudster's money on the
 *    table is the worst possible outcome. The DB is a mirror of Stripe's
 *    truth, not the source of truth for refund decisions.
 *
 * 2. **`charge_already_refunded` is not an error.** If someone already
 *    refunded the charge manually (or via a racing event), Stripe returns
 *    this error code. We swallow it because the goal — "this charge is
 *    refunded" — is already achieved. The Stripe `idempotencyKey` separately
 *    guards against this handler being invoked twice for the same EFW event.
 *
 * Other refund failures are treated as *permanent* and acked rather than
 * re-thrown. Re-throwing would let Stripe retry the whole event, but by
 * then the Purchase is already `REVOKED` (the `updateMany` ran before the
 * refund). On retry, the `updateMany` would no-op (status no longer ACTIVE)
 * and the refund would be attempted again with no protection against the
 * partially-completed prior state. Cleaner to ack and surface the failure
 * via logs so a human can refund from the dashboard.
 *
 * @param event - The verified `radar.early_fraud_warning.created` event.
 */
export async function handleEarlyFraudWarning(event: Stripe.RadarEarlyFraudWarningCreatedEvent) {
  const { object } = event.data
  const paymentIntentId = keyOf(object.payment_intent, 'id')
  const chargeId = keyOf(object.charge, 'id')

  if (!paymentIntentId || !chargeId) {
    console.log('Missing charge or payment_intent on EFW:', object.id)
    await recordEventProcessed(prisma, event.id)
    return
  }

  const updated = await prisma.purchase.updateMany({
    where: { stripePaymentIntentId: paymentIntentId, status: 'ACTIVE' },
    data: { status: 'REVOKED', revokedAt: new Date() },
  })

  if (updated.count === 0) {
    console.log('EFW for unknown or non-active purchase, refunding anyway:', paymentIntentId)
  }

  try {
    await stripe.refunds.create(
      {
        charge: chargeId,
        reason: 'fraudulent',
        metadata: { source: 'early_fraud_warning', eventId: event.id },
      },
      {
        idempotencyKey: `refund_efw_${event.id}`,
      },
    )
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError && err.code === 'charge_already_refunded') {
      console.log('EFW: charge already refunded, no action needed:', chargeId)
    } else {
      console.error('Failed to issue refund for EFW:', paymentIntentId, err)
    }
    await recordEventProcessed(prisma, event.id)
    return
  }

  await recordEventProcessed(prisma, event.id)
}
