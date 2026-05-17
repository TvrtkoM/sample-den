'use client'

import ErrorState from '@/components/error/ErrorState'
import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white font-sans antialiased">
        <ErrorState
          title="Something went wrong"
          message={error.digest ? `Error ID: ${error.digest}` : 'A critical error occurred. Please try again.'}
          onRetry={unstable_retry}
          className="max-w-md w-full mx-4"
        />
      </body>
    </html>
  )
}
