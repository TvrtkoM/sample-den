'use client'

import SampleActionButton from '@/components/samples/SampleActionButton'
import SamplePlayer from '@/components/samples/SamplePlayer'
import { Badge } from '@/components/ui/badge'
import { SamplesByIdsQueryResult } from '@/generated/groq/sanity-types'
import { priceFromCents } from '@/lib/utils'
import { format } from 'date-fns'

type LibraryPurchase = {
  id: string
  priceInCents: number
  createdAt: string
  sampleId: string
}

type LibrarySample = SamplesByIdsQueryResult['samples'][number]

type LibraryItemProps = {
  purchase: LibraryPurchase
  sample: LibrarySample | null
}

export default function LibraryItem({ purchase, sample }: LibraryItemProps) {
  if (!sample) {
    return (
      <div className="card-shadow-sm">
        <div className="card-section justify-between text-sm">
          <span className="text-muted-foreground">Sample no longer available</span>
          <span>{format(new Date(purchase.createdAt), 'PP')}</span>
        </div>
      </div>
    )
  }

  return (
    <section className="card-shadow-sm">
      <div className="card-section gap-2">
        {sample.categories?.map((c) => (
          <Badge variant="secondary" key={c.slug?.current ?? c.title}>
            {c.title}
          </Badge>
        ))}
      </div>

      {sample.highResFile?.mp3Url && (
        <div className="card-section bg-gray-100">
          <SamplePlayer src={sample.highResFile.mp3Url} />
        </div>
      )}

      <div className="card-section">
        <h4>{sample.title}</h4>
      </div>

      <div className="card-section justify-between text-sm text-muted-foreground">
        <span>Purchased {format(new Date(purchase.createdAt), 'PP')}</span>
        <span>{priceFromCents(purchase.priceInCents)}</span>
      </div>

      <div className="card-section">
        <SampleActionButton state="download" sampleId={purchase.sampleId} purchaseId={purchase.id} />
      </div>
    </section>
  )
}
