'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Page component displayed after sign-up prompting the user to check their inbox.
 */
export default function VerifyEmail() {
  return (
    <>
      <h1 className="mb-8 mt-4">Verify Your Email</h1>
      <div className="card-shadow-sm p-6">
        <div className="flex flex-col justify-center py-8">
          <div className="flex justify-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6">
              <Mail className="size-12 text-primary" />
            </div>
          </div>
          <h2 className="mb-6 text-xl text-center font-semibold">Check Your Inbox</h2>
          <p className="mb-2 max-w-md mx-auto">
            We&apos;ve sent a verification link to your email address. Click it to activate your account.
          </p>
          <p className="mb-8 text-muted-foreground max-w-md mx-auto text-sm">
            Sign in with your email after verification. If you didn&apos;t receive email, check your spam folder or sign
            up again with the correct address.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/samples">Browse samples</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
