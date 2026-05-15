'use client'

import { SamplesByIdsQueryResult } from '@/generated/groq/sanity-types'
import { LoaderCircle, ShoppingCart } from 'lucide-react'
import CartItem from './CartItem'

type CartProps = {
  samples: SamplesByIdsQueryResult['samples']
  isChangingPage: boolean
  isLoading: boolean
  isCartEmpty: boolean
}

export default function Cart({ samples, isChangingPage, isLoading, isCartEmpty }: CartProps) {
  if (isLoading || isChangingPage) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-muted-foreground">
        <LoaderCircle className="animate-spin size-20" />
      </div>
    )
  }

  if (isCartEmpty) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-center text-muted-foreground">
        <ShoppingCart className="size-12" />
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="flex flex-col gap-5 my-8">
        {samples.map((sample) => (
          <CartItem key={sample._id} sample={sample} />
        ))}
      </ul>
    </div>
  )
}
