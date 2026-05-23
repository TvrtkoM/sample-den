import 'server-only'

import { ArcjetDecision } from '@arcjet/next'
import { NextResponse } from 'next/server'

/**
 * Builds a JSON error response for a denied Arcjet decision on a generic API route.
 * Maps rate-limit denials to 429 and bot denials to 403, falling back to a generic
 * 403 for any other deny reason.
 *
 * @param decision - The denied Arcjet decision whose reason determines the response shape.
 * @returns A `NextResponse` with an `{ error }` payload and the appropriate HTTP status.
 */
export function arcjetDenyResponse(decision: ArcjetDecision) {
  const reason = decision.reason

  if (reason.isRateLimit()) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  }

  if (reason.isBot()) {
    return NextResponse.json({ error: 'Automated requests are not allowed.' }, { status: 403 })
  }

  return NextResponse.json({ error: 'Request blocked.' }, { status: 403 })
}

/**
 * Builds a JSON error response for a denied Arcjet decision on an auth route.
 * Returns a structured `{ message, code }` payload matching the auth client's
 * expected error format, covering rate limit, disallowed email, and bot reasons.
 *
 * @param decision - The denied Arcjet decision whose reason determines the response shape.
 * @returns A `NextResponse` with an `{ message, code }` payload and the appropriate HTTP status.
 */
export function arcjetDenyAuthResponse(decision: ArcjetDecision) {
  const { reason } = decision

  if (reason.isRateLimit()) {
    return NextResponse.json(
      { message: 'Too many requests. Try again later.', code: 'ARCJET_RATE_LIMIT' },
      { status: 429 },
    )
  }

  if (reason.isEmail()) {
    return NextResponse.json(
      { message: 'This email address is not allowed. Please use a different one.', code: 'ARCJET_DENY_EMAIL' },
      { status: 400 },
    )
  }

  if (reason.isBot()) {
    return NextResponse.json(
      { message: 'Automated requests are not allowed.', code: 'ARCJET_DENY_BOT' },
      { status: 403 },
    )
  }

  return NextResponse.json({ message: 'Request blocked.', code: 'ARCJET_DENY' }, { status: 403 })
}
