import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { ReactNode } from 'react'

/**
 * Server component that redirects unauthenticated or anonymous users to `/sign-in`.
 * Wrap any page or layout that requires a verified, non-anonymous session.
 */
const PrivateGuard = async ({ children }: { children: ReactNode }) => {
  await connection()
  const sessionData_ = await getSession()

  if (!sessionData_ || sessionData_.user.isAnonymous === true) {
    redirect('/sign-in')
  }

  return children
}

export default PrivateGuard
