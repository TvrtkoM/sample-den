'use client'

import { useAddToCart, useRemoveFromCart } from '@/hooks/use-cart'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

const sampleCartToggleButtonVariants = cva('w-full transition-all', {
  variants: {
    state: {
      buy: 'bg-primary text-primary-foreground hover:bg-primary/90',
      'in-cart': 'bg-accent text-foreground border-foreground border hover:bg-accent/80 hover:text-foreground',
    },
  },
  defaultVariants: {
    state: 'buy',
  },
})

export default function SampleCartToggleButton({
  state,
  sampleId,
  className,
}: {
  sampleId: string
  className?: string
} & VariantProps<typeof sampleCartToggleButtonVariants>) {
  const addToCart = useAddToCart()
  const removeFromCart = useRemoveFromCart()

  const handleClick = () => {
    switch (state) {
      case 'buy':
        return addToCart.mutate(sampleId)
      case 'in-cart':
        return removeFromCart.mutate(sampleId)
    }
  }

  const content = () => {
    switch (state) {
      case 'buy':
        return 'Add to cart'
      case 'in-cart':
        return 'Remove from cart'
    }
  }

  return (
    <Button className={cn(sampleCartToggleButtonVariants({ state }), className)} onClick={handleClick}>
      <ShoppingCart /> {content()}
    </Button>
  )
}
