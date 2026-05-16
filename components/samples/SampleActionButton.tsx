'use client'

import { Button } from '@/components/ui/button'
import { useAddToCart, useRemoveFromCart } from '@/hooks/use-cart'
import type { SampleActionState } from '@/lib/types'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Download, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const sampleActionButtonVariants = cva('w-full transition-all', {
  variants: {
    state: {
      buy: 'bg-primary text-primary-foreground hover:bg-primary/90',
      'in-cart': 'bg-accent text-foreground border-foreground border hover:bg-accent/80 hover:text-foreground',
      download: 'bg-accent text-foreground border-foreground border hover:bg-accent/80 hover:text-foreground',
    },
  },
  defaultVariants: {
    state: 'buy',
  },
})

type SampleActionButtonProps = VariantProps<typeof sampleActionButtonVariants> & {
  state: SampleActionState
  sampleId: string
  purchaseId: string | null
  className?: string
}

export default function SampleActionButton({ state, sampleId, purchaseId, className }: SampleActionButtonProps) {
  const addToCart = useAddToCart()
  const removeFromCart = useRemoveFromCart()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!purchaseId) return
    setIsDownloading(true)
    try {
      const res = await fetch(`/api/library/download?purchaseId=${encodeURIComponent(purchaseId)}`)
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Could not prepare download')
        return
      }
      const { url } = (await res.json()) as { url: string }
      window.location.href = url
    } catch {
      toast.error('Could not prepare download')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClick = () => {
    switch (state) {
      case 'buy':
        return addToCart.mutate(sampleId)
      case 'in-cart':
        return removeFromCart.mutate(sampleId)
      case 'download':
        return handleDownload()
      default: {
        const _exhaustive: never = state
        return _exhaustive
      }
    }
  }

  const content = () => {
    switch (state) {
      case 'buy':
        return (
          <>
            <ShoppingCart /> Add to cart
          </>
        )
      case 'in-cart':
        return (
          <>
            <ShoppingCart /> Remove from cart
          </>
        )
      case 'download':
        return (
          <>
            <Download /> {isDownloading ? 'Preparing...' : 'Download .wav'}
          </>
        )
      default: {
        const _exhaustive: never = state
        return _exhaustive
      }
    }
  }

  return (
    <Button
      className={cn(sampleActionButtonVariants({ state }), className)}
      onClick={handleClick}
      disabled={state === 'download' && isDownloading}
    >
      {content()}
    </Button>
  )
}

export { sampleActionButtonVariants }
