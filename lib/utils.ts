import { format } from 'date-fns'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Formats a price in cents as a USD string, e.g. `"$9.99"`.
 *
 * @param cents - Price amount in cents.
 * @returns Formatted price string with a leading `$` sign.
 */
export const priceFromCents = (cents: number) => `$${(cents / 100).toFixed(2)}`

/**
 * Formats a duration in seconds as a `mm:ss` string.
 * Returns `"00:00"` for falsy or infinite values.
 *
 * @param seconds - Duration in seconds.
 * @returns Formatted duration string, e.g. `"03:42"`.
 */
export function formatSecondsDuration(seconds: number): string {
  if (!seconds || seconds === Infinity) return '00:00'
  return format(seconds * 1000, 'mm:ss')
}

/**
 * Merges Tailwind CSS class names, resolving conflicts with `tailwind-merge`.
 *
 * @param inputs - Any combination of class values accepted by `clsx`.
 * @returns Merged class string with Tailwind conflicts resolved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Builds the `Set-Cookie` header value for the anonymous user id cookie.
 * When `userId` is provided the cookie is set with a 5-minute max-age;
 * when omitted the cookie is cleared (max-age 0).
 *
 * @param userId - The anonymous user id to store, or `undefined` to clear the cookie.
 * @returns A `Set-Cookie` string ready to be sent as a response header or assigned to `document.cookie`.
 */
export function getAnonymousUserIdCookie(userId?: string) {
  if (userId) {
    return `anonymous-user-id=${userId}; path=/; max-age=300; SameSite=Lax`
  }
  return 'anonymous-user-id=; Path=/; Max-Age=0; SameSite=Lax'
}

/**
 * Builds the `Set-Cookie` header value for the sign-up verification cookie.
 * Pass `clear: true` to expire the cookie immediately; omit it to set a 1-hour
 * cookie that signals the user just registered and is awaiting email verification.
 *
 * @param clear - When `true`, returns an expiring cookie string.
 * @returns A `Set-Cookie` string ready to be sent as a response header or assigned to `document.cookie`.
 */
export function getSignUpVerificationCookie(clear?: true) {
  if (clear) {
    return 'signUpVerification=; path=/; max-age=0'
  }
  return 'signUpVerification=true; path=/; max-age=3600; SameSite=Lax'
}
