import { getSession } from "./getSession"
import prisma from "./prisma";


export async function getCartItems() {
  const session = await getSession()

  if (!session) {
    return [];
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return cartItems.map((item) => item.sampleId)
}