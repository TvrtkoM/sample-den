'use client'

import { useCartSize } from '@/hooks/use-cart'
import { ShoppingBag } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { startTransition } from 'react'
import { useShowCart } from '@/lib/store/cart'

export default function CartIcon() {
  const cartSize = useCartSize()
  const showCart = useShowCart()

  return (
    <Button
      type="button"
      aria-label="View cart"
      className="relative rounded-full h-9 flex items-center"
      onClick={() => {
        startTransition(() => {
          showCart()
        })
      }}
    >
      cart
      <Badge className="absolute -top-[30%] -right-[15%] bg-background text-foreground border border-gray-400">
        {cartSize}
      </Badge>
      <ShoppingBag />
    </Button>
  )
}
