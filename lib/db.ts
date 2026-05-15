import 'server-only'
import { getSession } from './getSession'
import prisma from './prisma'

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
