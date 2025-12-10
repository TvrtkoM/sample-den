import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ items: [] })
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ items: cartItems.map((item) => item.sampleId) })
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
