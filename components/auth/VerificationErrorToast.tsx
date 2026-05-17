'use client'

import { parseAsStringEnum, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'

/**
 * Headless component that shows an error toast when the URL contains a
 * `?error=token_expired` or `?error=invalid_token` query parameter.
 * Renders an empty fragment — mount it on the sign-in page.
 */
const VerificationErrorToast = () => {
  const [error] = useQueryState('error', parseAsStringEnum(['token_expired', 'invalid_token']))

  useEffect(() => {
    if (error === 'token_expired') {
      toast.error('Email verification url expired')
    }
    if (error === 'invalid_token') {
      toast.error('Verification invalid')
    }
  }, [error])

  return <></>
}

export default VerificationErrorToast
