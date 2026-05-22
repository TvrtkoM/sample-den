import PurchasesAccordion from '@/components/profile/PurchasesAccordion'
import { Button } from '@/components/ui/button'
import { fetchSamplesByIds } from '@/lib/fetch/samples'
import { getSession } from '@/lib/getSession'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Purchases' }

export default async function PurchasesPage() {
  const session = await getSession()

  const purchases = await prisma.purchase.findMany({
    where: { userId: session!.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  if (purchases.length === 0) {
    return (
      <section className="card-shadow-sm p-6 container-small">
        <h2 className="mb-2">No purchases yet</h2>
        <p className="mb-4 text-sm text-muted-foreground">Browse the catalog to find samples you like.</p>
        <div className="flex justify-start">
          <Button asChild>
            <Link href="/samples">Browse samples</Link>
          </Button>
        </div>
      </section>
    )
  }

  const allSampleIds = [...new Set(purchases.flatMap((p) => p.items.map((i) => i.sampleId)))]
  const samples = await fetchSamplesByIds(allSampleIds)
  const sampleTitles = Object.fromEntries(samples.map((s) => [s._id, s.title ?? '']))

  const purchaseRows = purchases.map((p) => ({
    id: p.id,
    createdAt: p.createdAt.toISOString(),
    status: p.status,
    items: p.items.map((i) => ({ id: i.id, sampleId: i.sampleId, priceInCents: i.priceInCents })),
  }))

  return (
    <section>
      <h2 className="mb-6">Purchases</h2>
      <PurchasesAccordion purchases={purchaseRows} sampleTitles={sampleTitles} />
    </section>
  )
}
