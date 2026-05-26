import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import ErrorState from '@/components/error/ErrorState'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Reset Password' }

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams

  return (
    <main className="container-small">
      <div className="flex justify-between mb-8 mt-4">
        <h1>Reset Password</h1>
        <Button variant={'link'} asChild>
          <Link href={'/sign-in'} className="flex items-center">
            <ChevronLeft /> Back to sign in
          </Link>
        </Button>
      </div>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <ErrorState title="Missing reset token" message="The reset link is invalid or has expired." className="p-6" />
      )}
    </main>
  )
}
