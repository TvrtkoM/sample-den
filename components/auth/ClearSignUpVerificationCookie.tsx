'use client'

import { getSignUpVerificationCookie } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Headless component that clears the `signUpVerification` cookie on mount.
 * Renders nothing — mount it once the verification flow is complete so the
 * "check your inbox" prompt is not shown again on subsequent visits.
 */
export function ClearSignUpVerificationCookie() {
  useEffect(() => {
    document.cookie = getSignUpVerificationCookie(true)
  }, [])

  return null
}
