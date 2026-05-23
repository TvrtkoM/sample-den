import 'server-only'

import arcjet, { ArcjetDecision, shield } from '@arcjet/next'
import { NextResponse } from 'next/server'
import { arcjetDenyAuthResponse, arcjetDenyResponse } from './respond'

const enabled = process.env.ARCJET_ENABLED === 'true'

/**
 * Shared Arcjet client used across protected API routes.
 * `shield` is enabled globally as a zero-config defence against common web attacks
 * (SQLi, XSS probes, etc.). Per-route rules (rate limit, bot detection, email
 * validation) are layered on top with `aj.withRule(...)` inside each route file.
 */
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [shield({ mode: 'LIVE' })],
})

/**
 * Runs an Arcjet protection check and converts a denied decision into the
 * appropriate JSON error response. Returns `null` when the request is allowed
 * (or when Arcjet is disabled via `ARCJET_ENABLED`), letting the caller proceed.
 *
 * @param protect - Callback that invokes `aj.protect(...)` for the current request.
 * @param options - Per-call options controlling response shape.
 * @param options.isAuth - When `true`, denied responses use the auth payload from {@link arcjetDenyAuthResponse}; otherwise the generic one from {@link arcjetDenyResponse}.
 * @defaultValue `options` defaults to `{ isAuth: false }`.
 * @returns A `NextResponse` to short-circuit the route on deny, or `null` to continue handling the request.
 */
export async function protectOrAllow(
  protect: () => Promise<ArcjetDecision>,
  options: { isAuth: boolean } = { isAuth: false },
): Promise<NextResponse | null> {
  if (!enabled) {
    return null
  }
  const decision = await protect()
  if (decision.isDenied()) {
    if (options.isAuth) {
      return arcjetDenyAuthResponse(decision)
    } else {
      return arcjetDenyResponse(decision)
    }
  }
  return null
}
