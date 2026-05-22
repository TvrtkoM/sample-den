'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { PurchaseStatus } from '@/generated/prisma/client'
import { priceFromCents } from '@/lib/utils'
import { format } from 'date-fns'

type PurchaseItemRow = {
  id: number
  sampleId: string
  priceInCents: number
}

type PurchaseRow = {
  id: number
  createdAt: string
  status: PurchaseStatus
  items: PurchaseItemRow[]
}

type NonActivePurchaseStatus = Exclude<PurchaseStatus, 'ACTIVE'>

type PurchasesAccordionProps = {
  purchases: PurchaseRow[]
  /** Map of sampleId to display title; missing entries render a fallback. */
  sampleTitles: Record<string, string>
}

const statusMessages: Record<Exclude<PurchaseStatus, 'ACTIVE'>, string> = {
  DISPUTED: 'This purchase is currently under dispute.',
  REFUNDED: 'This purchase has been refunded and is not available for download.',
  REVOKED: 'Access to this purchase has been revoked.',
}

const statusBadgeVariants: Record<NonActivePurchaseStatus, 'destructive' | 'secondary' | 'outline'> = {
  DISPUTED: 'destructive',
  REFUNDED: 'secondary',
  REVOKED: 'outline',
}

const statusLabels: Record<NonActivePurchaseStatus, string> = {
  DISPUTED: 'Disputed',
  REFUNDED: 'Refunded',
  REVOKED: 'Revoked',
}

export default function PurchasesAccordion({ purchases, sampleTitles }: PurchasesAccordionProps) {
  return (
    <div className="card-shadow-sm px-6">
      <Accordion type="single" collapsible>
        {purchases.map((purchase) => {
          const total = purchase.items.reduce((sum, item) => sum + item.priceInCents, 0)

          return (
            <AccordionItem key={purchase.id} value={String(purchase.id)}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{format(new Date(purchase.createdAt), 'PPp')}</span>
                  <div className="flex items-center gap-2 ml-auto">
                    {purchase.status !== 'ACTIVE' && (
                      <Badge variant={statusBadgeVariants[purchase.status]}>{statusLabels[purchase.status]}</Badge>
                    )}
                    <span className="font-medium">{priceFromCents(total)}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {purchase.status !== 'ACTIVE' && (
                  <p className="text-yellow-700 mb-4 font-bold">{statusMessages[purchase.status]}</p>
                )}
                <ul className="space-y-2">
                  {purchase.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>{sampleTitles[item.sampleId] ?? 'Sample no longer available'}</span>
                      <span className="text-muted-foreground">{priceFromCents(item.priceInCents)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm font-medium mt-6">
                  <span>Total</span>
                  <span>{priceFromCents(total)}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
