import SignUpForm from '@/components/auth/SignUpForm'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sign Up' }

export default async function SignUpPage() {
  return (
    <main className="container-small">
      <div className="flex justify-between mb-8 mt-4">
        <h1>Sign Up</h1>
        <Button variant={'link'} asChild>
          <Link href={'/samples'} className="flex items-center">
            <ChevronLeft /> Back to samples
          </Link>
        </Button>
      </div>
      <SignUpForm />
      <p className="mt-3">
        Already have an account?{' '}
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href={{ pathname: '/sign-in' }}>Sign In</Link>
        </Button>
      </p>
    </main>
  )
}
