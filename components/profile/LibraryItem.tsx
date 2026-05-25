'use client'

import SampleDownloadButton from '@/components/samples/SampleDownloadButton'
import SamplePlayer from '@/components/samples/SamplePlayer'
import { Badge } from '@/components/ui/badge'
import { SamplesByIdsQueryResult } from '@/generated/groq/sanity-types'
import { PurchaseItem } from '@/generated/prisma/client'
import { priceFromCents } from '@/lib/utils'
import { format } from 'date-fns'

/**
 * Purchase item record
 */
type LibraryPurchase = Pick<PurchaseItem, 'id' | 'priceInCents' | 'sampleId' | 'sampleTitle'> & { createdAt: string }

/** Sanity sample document shape used in the library view. */
type LibrarySample = SamplesByIdsQueryResult['samples'][number]

/**
 * Props for {@link LibraryItem}.
 */
type LibraryItemProps = {
  /** Purchase record from the database. */
  purchase: LibraryPurchase
  /** Matching Sanity sample document, or `null` if the sample has been deleted from the CMS. */
  sample: LibrarySample | null
}

/**
 * Displays a purchased sample in the user's library with its audio player,
 * categories, purchase date, price, and a download button.
 * Shows a graceful fallback card when the sample is no longer available in the CMS.
 */
export default function LibraryItem({ purchase, sample }: LibraryItemProps) {
  if (!sample) {
    return (
      <section className="card-shadow-sm">
        <div className="card-section justify-between text-sm">
          <h4>{purchase.sampleTitle}</h4>
          <span className="text-muted-foreground">Sample no longer available</span>
          <span>{format(new Date(purchase.createdAt), 'PP')}</span>
        </div>
      </section>
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
        <h4>{purchase.sampleTitle}</h4>
      </div>

      <div className="card-section justify-between text-sm text-muted-foreground">
        <span>Purchased {format(new Date(purchase.createdAt), 'PP')}</span>
        <span>{priceFromCents(purchase.priceInCents)}</span>
      </div>

      <div className="card-section">
        <SampleDownloadButton purchaseId={purchase.id} />
      </div>
    </section>
  )
}
