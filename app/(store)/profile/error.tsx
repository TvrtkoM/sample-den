'use client'

import ErrorState from '@/components/error/ErrorState'
import { useEffect } from 'react'

export default function ProfileError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex min-h-[50vh] items-center justify-center py-20">
      <ErrorState
        title="Failed to load profile"
        message={
          error.digest ? `Error ID: ${error.digest}` : 'There was a problem loading your profile. Please try again.'
        }
        onRetry={unstable_retry}
        className="max-w-md w-full"
      />
    </div>
  )
}
