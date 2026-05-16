'use client'

import { SamplesPageQueryResult } from '@/generated/groq/sanity-types'
import { useIsInCart } from '@/hooks/use-cart'
import type { SampleActionState } from '@/lib/types'
import { formatSecondsDuration } from '@/lib/utils'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import SampleActionButton from './SampleActionButton'
import SamplePlayer from './SamplePlayer'

type SampleItemProps = {
  sample: SamplesPageQueryResult['samples'][number]
  purchaseId: string | null
}

export default function SampleItem({ sample, purchaseId }: SampleItemProps) {
  const [duration, setDuration] = useState(0)
  const isInCart = useIsInCart(sample._id)

  const actionState: SampleActionState = purchaseId ? 'download' : isInCart ? 'in-cart' : 'buy'

  return (
    <li className="card-shadow-sm h-64 justify-between">
      <div className="card-section gap-2">
        {sample.categories?.map((c) => (
          <Badge variant="secondary" key={c?.slug?.current}>
            {c?.title}
          </Badge>
        ))}
      </div>

      {sample.highResFile?.mp3Url && (
        <div className="card-section bg-gray-100">
          <SamplePlayer src={sample.highResFile.mp3Url} onReady={(duration) => setDuration(duration)} />
        </div>
      )}

      <div className="card-section">
        <h4>{sample.title}</h4>
      </div>

      <div className="card-section justify-between text-sm">
        <div>{formatSecondsDuration(duration)}</div>
        <div className="font-semibold">{sample.priceUsd} $</div>
      </div>

      <div className="card-section">
        <SampleActionButton state={actionState} sampleId={sample._id} purchaseId={purchaseId} />
      </div>
    </li>
  )
}
