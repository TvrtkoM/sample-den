'use client'

import { SamplesByIdsQueryResult } from '@/generated/groq/sanity-types'
import { useRemoveFromCartInCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import SamplePlayer from '../samples/SamplePlayer'
import { Button } from '../ui/button'

type CartItemProps = {
  sample: SamplesByIdsQueryResult['samples'][number]
}

export default function CartItem({ sample }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const removeFromCart = useRemoveFromCartInCart({
    onRemoveStart: () => setIsRemoving(true),
  })

  return (
    <li
      className={cn('flex flex-col gap-3 card mx-4', {
        'opacity-50 pointer-events-none': isRemoving,
      })}
    >
      <div className="flex items-center justify-between gap-2 card-section">
        <h3 className="font-medium truncate flex-1">{sample.title}</h3>
        <span className="font-semibold whitespace-nowrap">{sample.priceUsd} $</span>
      </div>

      {sample.highResFile?.mp3Url && (
        <div className="bg-gray-100 card-section">
          <SamplePlayer src={sample.highResFile.mp3Url} />
        </div>
      )}

      <div className="flex justify-end card-section">
        <Button variant="ghost" size="sm" onClick={() => removeFromCart.mutate(sample._id)}>
          <Trash2 className="size-4" />
          {isRemoving ? 'Removing...' : 'Remove'}
        </Button>
      </div>
    </li>
  )
}
