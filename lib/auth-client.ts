import "client-only"
import { createAuthClient } from 'better-auth/react'
import { anonymousClient } from 'better-auth/client/plugins'

const authClient = createAuthClient({ plugins: [anonymousClient()] });

export const { signIn, signUp, signOut, getSession } = authClient

export const useSessionAuth = authClient.useSession;
