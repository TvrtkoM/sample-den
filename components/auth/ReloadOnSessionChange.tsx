'use client'

import { useSession } from '@/hooks/use-session'
import { useEffect, useRef } from 'react'

export default function ReloadOnAuthAction() {
  const { session } = useSession()
  const userRef = useRef(session?.user.id)

  useEffect(() => {
    if (userRef.current !== session?.user.id) {
      console.log('reload')
      window.location.reload()
    }
  }, [session?.user.id])

  return null
}
