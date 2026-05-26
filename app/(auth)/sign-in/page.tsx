import SignInForm from '@/components/auth/SignInForm'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sign In' }

export default async function SignInPage() {
  return (
    <main className="container-small">
      <div className="flex justify-between mb-8 mt-4">
        <h1>Sign In</h1>
        <Button variant={'link'} asChild>
          <Link href={'/samples'} className="flex items-center">
            <ChevronLeft /> Back to samples
          </Link>
        </Button>
      </div>
      <SignInForm />
      <p className="mt-3">
        Don&apos;t have an account?{' '}
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href={{ pathname: '/sign-up' }}>Sign Up</Link>
        </Button>
      </p>
    </main>
  )
}
