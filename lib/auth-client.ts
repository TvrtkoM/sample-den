import 'client-only'
import { createAuthClient } from 'better-auth/react'
import { anonymousClient } from 'better-auth/client/plugins'

const authClient = createAuthClient({ plugins: [anonymousClient()] })

/**
 * Client-side auth actions: sign in, sign up, sign out, get session, and send a
 * verification email. Backed by better-auth with the anonymous plugin enabled.
 */
export const { signIn, signUp, signOut, getSession, sendVerificationEmail } = authClient

/**
 * React hook that returns the current better-auth session for the signed-in user.
 * Re-renders on session changes; returns `null` when no session exists.
 */
export const useSessionAuth = authClient.useSession
