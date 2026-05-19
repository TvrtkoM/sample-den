'use client'

import { useSetCartVisible } from '@/lib/store/cart'
import { X } from 'lucide-react'
import { startTransition } from 'react'
import { Button } from '../ui/button'

/** Header bar of the cart drawer displaying the title and a close button. */
const CartHeader = () => {
  const setCartVisible = useSetCartVisible()
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          startTransition(() => {
            setCartVisible(false)
          })
        }}
      >
        <X className="size-5" />
      </Button>
    </div>
  )
}

export default CartHeader
