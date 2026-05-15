'use client'

import { Mail } from 'lucide-react'
import { useEffect } from 'react'

export default function VerifyEmail() {
  useEffect(() => {
    history.pushState(null, '', window.location.pathname)

    const onPopState = () => {
      window.location.reload()
    }

    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  return (
    <>
      <h1 className="mb-8 mt-4">Verify Your Email</h1>
      <div className="card-shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-6 rounded-full bg-primary/10 p-6">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mb-4 text-center text-xl font-semibold">Check Your Inbox</h2>
          <p className="mb-2 text-center text-muted-foreground max-w-md">
            We&apos;ve sent a verification link to your email address.
          </p>
          <p className="text-center text-muted-foreground max-w-md">
            Please check your inbox and click the link to verify your account.
          </p>
        </div>
      </div>
    </>
  )
}
