import 'server-only'
import { getSession } from './getSession'
import prisma from './prisma'
import type { PurchasesMap } from './types'

export async function getCartSamplesIds() {
  const session = await getSession()

  if (!session) {
    return []
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  return cartItems.map((item) => item.sampleId)
}

/**
 * Resolve, for the given sample ids, which the current user has already
 * purchased.
 *
 * @param sampleIds - Sample ids to check (typically the current store page).
 * @returns A sparse {@link PurchasesMap}: only purchased sample ids are
 * present, mapped to their purchase id. Empty when there is no authenticated
 * (non-anonymous) user.
 */
export async function getPurchasesMap(sampleIds: string[]): Promise<PurchasesMap> {
  const session = await getSession()

  if (!session || session.user.isAnonymous || sampleIds.length === 0) {
    return {}
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id, sampleId: { in: sampleIds } },
    select: { id: true, sampleId: true },
  })

  return purchases.reduce<PurchasesMap>((map, purchase) => {
    map[purchase.sampleId] = purchase.id
    return map
  }, {})
}

// migrate cart from anonymous user to user, but only if there are items in cart of fromUserId
export async function migrateCart(fromUserId: string, toUserId: string) {
  const items = await prisma.cartItem.findMany({ where: { userId: fromUserId } })
  if (items.length === 0) {
    return
  }
  await prisma.cartItem.deleteMany({
    where: { userId: toUserId },
  })

  await prisma.cartItem.updateMany({
    where: { userId: fromUserId },
    data: { userId: toUserId },
  })
}
