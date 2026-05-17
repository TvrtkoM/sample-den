import 'server-only'
import { headers } from 'next/headers'
import { auth } from './auth'
import { cache } from 'react'

/**
 * Returns the current server-side session for the incoming request.
 * The result is deduped with React `cache` so multiple RSC calls within the
 * same request share one database lookup.
 *
 * @returns The active session object, or `null` when the user is not signed in.
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
})
