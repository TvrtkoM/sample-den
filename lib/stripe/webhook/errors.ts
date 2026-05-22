import 'server-only'

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

/**
 * Discriminated, JSON-serializable description of an error caught in the
 * webhook handler. Maps directly onto the `WebhookEventFailure` row written
 * by {@link persistFailure}.
 *
 * `source` tells the operator at a glance whether the failure came from the
 * payments provider, the database, or somewhere else — without grepping
 * `message` strings, which are not a stable API.
 */
export type ErrorDescription = {
  source: 'stripe' | 'prisma' | 'unknown'
  errorName: string
  errorCode: string | null
  statusCode: number | null
  requestId: string | null
  message: string
  stack: string | null
  meta: Prisma.InputJsonValue | null
}

/**
 * Classifies an unknown error into a structured row suitable for persistence.
 *
 * `instanceof` is used against the exported error classes from Prisma and
 * Stripe because both libraries treat those classes as their stable contract.
 * `err.constructor.name` and string matching on `err.message` are deliberately
 * avoided — bundlers can mangle class names and messages are not versioned.
 *
 * Order of checks matters: the most specific Prisma class
 * (`PrismaClientKnownRequestError`, which carries `code` and `meta`) is
 * checked before the broader Prisma base classes, and the generic
 * `Stripe.errors.StripeError` catches every Stripe subclass at once.
 *
 * @param err - The value caught in a `catch` clause (typed `unknown`).
 * @returns A flat, JSON-friendly description ready to insert into
 *   `webhook_event_failure`.
 */
export function describeError(err: unknown): ErrorDescription {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      source: 'prisma',
      errorName: err.name,
      errorCode: err.code,
      statusCode: null,
      requestId: null,
      message: err.message,
      stack: err.stack ?? null,
      meta: (err.meta as Prisma.InputJsonValue | undefined) ?? null,
    }
  }

  if (
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    return {
      source: 'prisma',
      errorName: err.name,
      errorCode: null,
      statusCode: null,
      requestId: null,
      message: err.message,
      stack: err.stack ?? null,
      meta: null,
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      source: 'prisma',
      errorName: err.name,
      errorCode: err.errorCode ?? null,
      statusCode: null,
      requestId: null,
      message: err.message,
      stack: err.stack ?? null,
      meta: null,
    }
  }

  if (err instanceof Stripe.errors.StripeError) {
    return {
      source: 'stripe',
      errorName: err.name,
      errorCode: err.code ?? null,
      statusCode: err.statusCode ?? null,
      requestId: err.requestId ?? null,
      message: err.message,
      stack: err.stack ?? null,
      meta: null,
    }
  }

  if (err instanceof Error) {
    return {
      source: 'unknown',
      errorName: err.name,
      errorCode: null,
      statusCode: null,
      requestId: null,
      message: err.message,
      stack: err.stack ?? null,
      meta: null,
    }
  }

  return {
    source: 'unknown',
    errorName: 'NonError',
    errorCode: null,
    statusCode: null,
    requestId: null,
    message: String(err),
    stack: null,
    meta: null,
  }
}

/**
 * Writes one `WebhookEventFailure` row per retry-triggering error so the
 * database carries an audit trail of every 500 returned to Stripe. Swallows
 * its own errors — if persistence itself fails we still want to return 500
 * to Stripe so the original event gets retried.
 *
 * @param event - The verified Stripe event whose processing failed.
 * @param err - The error caught by the outer webhook handler.
 */
export async function persistFailure(event: Stripe.Event, err: unknown) {
  try {
    const { meta, ...description } = describeError(err)
    await prisma.webhookEventFailure.create({
      data: {
        stripeEventId: event.id,
        eventType: event.type,
        ...description,
        meta: meta ?? Prisma.JsonNull,
      },
    })
  } catch (persistErr) {
    console.error('Failed to persist webhook failure:', persistErr)
  }
}
