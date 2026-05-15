'use client'

import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { startTransition } from 'react'
import { useHideCart } from '@/lib/store/cart'

const CartHeader = () => {
  const hideCart = useHideCart()
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(() => {
            hideCart()
          })
        }}
      >
        <X className="size-5" />
      </Button>
    </div>
  )
}

export default CartHeader
