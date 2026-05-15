'use client'

import { parseAsStringEnum, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { toast } from 'sonner'

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
