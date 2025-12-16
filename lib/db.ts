import { getSession } from "./getSession"
import prisma from "./prisma";


export async function getCartSamplesIds() {
  const session = await getSession()

  if (!session) {
    return [];
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  return cartItems.map((item) => item.sampleId)
}