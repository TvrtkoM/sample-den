'use client'

import { useSession } from '@/hooks/use-session'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

const CheckoutButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session } = useSession()
  const pathname = usePathname()

  const isAuth = session != null && session.user.isAnonymous === false

  const checkout = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/payment/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({
          cancelPath: pathname,
        }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Checkout failed')
        setIsSubmitting(false)
        return
      }
      const { url }: { url: string } = await res.json()
      window.location.href = url
    } catch {
      toast.error('Checkout failed')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isAuth ? (
        <Button size={'lg'} className="text-xl" onClick={() => checkout()} disabled={isSubmitting}>
          Checkout
        </Button>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button size={'lg'} className="text-xl" asChild>
            <Link
              href={{
                pathname: '/sign-in',
              }}
            >
              Sign in to continue
            </Link>
          </Button>
          <Button size={'lg'} className="text-xl" asChild>
            <Link href={{ pathname: '/sign-up' }}>Create an account</Link>
          </Button>
        </div>
      )}
    </>
  )
}

export default CheckoutButton
