'use client'

import { useCartTotalPrice } from '@/hooks/use-cart'
import { useState } from 'react'
import AppPagination from '../AppPagination'
import { Button } from '../ui/button'
import { useSession } from '@/hooks/use-session'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'
import { toast } from 'sonner'

const CheckoutButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session } = useSession()

  const isAuth = session != null && session.user.isAnonymous === false

  const checkout = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/payment/checkout-sessions', {
        method: 'POST',
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

const CartTotalPrice = () => {
  const { data: totalPrice, isLoading, isError } = useCartTotalPrice()

  if (isLoading) {
    return <Skeleton className="h-7 w-1/2 mx-auto" />
  }

  if (isError) {
    return <p className="text-sm text-red-600 mx-auto h-7 flex items-center">Couldn&apos;t load total</p>
  }

  return (
    <p className="text-xl h-7 text-center">
      <span className="font-bold">Total:</span> {totalPrice} $
    </p>
  )
}

/**
 * Props for {@link CartFooter}.
 */
type CartFooterProps = {
  /** The currently active cart page number. */
  pageNum: number
  /** Called with the new page number when the user changes pages. */
  setPageNum: (pageNum: number) => void
  /** Total number of cart pages. */
  totalPages: number
}

/**
 * Footer section of the cart drawer showing pagination, total price, and the checkout button.
 * Pagination is hidden when there is only a single page of items.
 */
const CartFooter = ({ pageNum, setPageNum, totalPages }: CartFooterProps) => {
  return (
    <div className="flex flex-col">
      {totalPages > 1 && (
        <div className="border-t py-4">
          <AppPagination pageNum={pageNum} onPageChange={setPageNum} totalPages={totalPages} />
        </div>
      )}
      <div className="flex flex-col gap-4 px-4 py-4 border-t h-52">
        <CartTotalPrice />
        <CheckoutButton />
      </div>
    </div>
  )
}

export default CartFooter
