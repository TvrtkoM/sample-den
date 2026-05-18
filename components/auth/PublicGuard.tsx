import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { ReactNode } from 'react'

/**
 * Server component that redirects authenticated (non-anonymous) users to `/samples`.
 * Wrap pages that should only be accessible to guests, such as sign-in and sign-up.
 */
const PublicGuard = async ({ children }: { children: ReactNode }) => {
  await connection()
  const sessionData_ = await getSession()

  if (!sessionData_ || sessionData_.user.isAnonymous === true) {
    return children
  }

  redirect('/samples')
}

export default PublicGuard
