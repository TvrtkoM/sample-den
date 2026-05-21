'use client'

import { useAddTopMessage } from '@/lib/store/top-messages'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Headless component that shows messages when the URL contains a
 * `?error=token_expired` or `?error=invalid_token` query parameter.
 */
const VerificationMessageHandler = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const addTopMessage = useAddTopMessage()

  useEffect(() => {
    if (error?.toLowerCase() === 'token_expired') {
      addTopMessage(
        {
          Content: 'Verfication token expired. Please contact support to verify your account.',
          severity: 'error',
          dismissOnNavigate: true,
        },
        'verification_token_expired',
      )
    }
    if (error?.toLowerCase() === 'invalid_token') {
      addTopMessage(
        {
          Content: 'Verfication token invalid.',
          severity: 'error',
          dismissOnNavigate: true,
        },
        'verification_token_invalid',
      )
    }
  }, [error, addTopMessage])

  return null
}

export default VerificationMessageHandler
