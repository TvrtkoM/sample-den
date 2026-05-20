import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

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
    if (event.type === 'checkout.session.completed') {
      const existingEvent = await prisma.processedWebhookEvent.findUnique({ where: { stripeEventId: event.id } })

      if (existingEvent) {
        console.log(`Event ${event.id} already processed, skipping`)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const session = event.data.object

      if (session.payment_status !== 'paid') {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const meta = session.metadata
      if (!meta?.userId || !meta?.checkoutIp || !meta?.checkoutUserAgent) {
        console.error('Missing required metadata in checkout session:', session.id)
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
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
        await tx.processedWebhookEvent.create({
          data: { stripeEventId: event.id },
        })
        await tx.purchase.create({
          data: {
            userId,
            stripeSessionId: session.id,
            checkoutIp,
            checkoutUserAgent,
            items: { create: purchases },
          },
        })
        await tx.cartItem.deleteMany({ where: { userId, sampleId: { in: sampleIds } } })
      })

      console.log(`Checkout completed for user ${userId}, cleared ${sampleIds.length} cart items`)
    }
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    // in case db transaction fails - purchase already recorded in case 2 concurrent events happen
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ received: true }, { status: 200 })
    }
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
