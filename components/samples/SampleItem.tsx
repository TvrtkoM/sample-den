'use client'

import { SamplesPageQueryResult } from '@/generated/groq/sanity-types'
import { useIsInCart } from '@/hooks/use-cart'
import type { SampleActionState } from '@/lib/types'
import { formatSecondsDuration } from '@/lib/utils'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import SampleCartToggleButton from './SampleCartToggleButton'
import SampleDownloadButton from './SampleDownloadButton'
import SamplePlayer from './SamplePlayer'

/**
 * Props for {@link SampleItem}.
 */
type SampleItemProps = {
  /** Sanity sample document for this card. */
  sample: SamplesPageQueryResult['samples'][number]
  /** Purchase id when the current user owns this sample, or `null` otherwise. */
  purchaseId: string | null
}

/**
 * Fixed-height card for a single sample in the store listing.
 * Displays categories, an audio player, title, duration, price, and an
 * action button whose appearance depends on the current {@link SampleActionState}.
 */
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
        {(actionState === 'buy' || actionState === 'in-cart') && (
          <SampleCartToggleButton state={actionState} sampleId={sample._id} />
        )}
        {actionState === 'download' && <SampleDownloadButton purchaseId={purchaseId} />}
      </div>
    </li>
  )
}
