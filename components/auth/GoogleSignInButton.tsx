'use client'

import { useSession } from '@/hooks/use-session'
import { signIn } from '@/lib/auth-client'
import { getAnonymousUserIdCookie } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSession()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    if (session?.user.isAnonymous) {
      document.cookie = getAnonymousUserIdCookie(session.user.id)
    }
    await signIn.social({
      provider: 'google',
      callbackURL: `/samples`,
    })
  }

  return (
    <Button type="button" onClick={handleGoogleSignIn} disabled={isLoading} variant={'outline'}>
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        />
        <path
          fill="#34A853"
          d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 0 0 9.003 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.712A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.96A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.96 4.042l3.004-2.33z"
        />
        <path
          fill="#EA4335"
          d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .96 4.958l3.005 2.332c.708-2.127 2.692-3.71 5.036-3.71z"
        />
      </svg>
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  )
}
