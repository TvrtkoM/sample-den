import 'server-only'
import { getSession } from './getSession'
import prisma from './prisma'
import type { PurchasesMap } from './types'

/**
 * Returns the ordered list of sample ids currently in the authenticated user's cart.
 * Returns an empty array when there is no active session.
 *
 * @returns Ordered array of sample ids from the cart, oldest first.
 */
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
    orderBy: { createdAt: 'asc' },
  })

  return purchases.reduce<PurchasesMap>((map, purchase) => {
    map[purchase.sampleId] = purchase.id
    return map
  }, {})
}

/**
 * Transfers all cart items from an anonymous user to a newly authenticated user.
 * Deletes any existing items in the destination user's cart before transferring,
 * and is a no-op when the source cart is empty.
 *
 * @param fromUserId - The anonymous user whose cart items are transferred.
 * @param toUserId - The authenticated user who receives the cart items.
 */
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
