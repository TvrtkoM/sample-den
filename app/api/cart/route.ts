import { getCartItems } from '@/lib/db'
import { getSession } from '@/lib/getSession'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ items: await getCartItems() })
}

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sampleId } = await request.json()

  if (!sampleId || typeof sampleId !== 'string') {
    return NextResponse.json({ error: 'Invalid sampleId' }, { status: 400 })
  }

  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_sampleId: {
        userId: session.user.id,
        sampleId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      sampleId,
    },
  })

  return NextResponse.json({ item: cartItem })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sampleId } = await request.json()

  if (!sampleId || typeof sampleId !== 'string') {
    return NextResponse.json({ error: 'Invalid sampleId' }, { status: 400 })
  }

  await prisma.cartItem.deleteMany({
    where: {
      userId: session.user.id,
      sampleId,
    },
  })

  return NextResponse.json({ success: true })
}
