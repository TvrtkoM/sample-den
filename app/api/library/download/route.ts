import { getSession } from '@/lib/getSession'
import prisma from '@/lib/prisma'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
})

const DOWNLOAD_EXPIRY_SECONDS = 60

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.user.isAnonymous === true) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const purchaseId = req.nextUrl.searchParams.get('purchaseId')
  if (!purchaseId) {
    return NextResponse.json({ error: 'Missing purchaseId' }, { status: 400 })
  }

  const id = Number(purchaseId)
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: 'Invalid purchaseId' }, { status: 400 })
  }

  const purchase = await prisma.purchaseItem.findFirst({
    where: { id, purchase: { userId: session.user.id, status: 'ACTIVE' } },
  })
  if (!purchase) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const s3Key = purchase.s3Key
  const fileName = purchase.filename

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_PRIVATE_BUCKET!,
    Key: s3Key,
    ResponseContentDisposition: `attachment; filename="${fileName ?? 'sample.wav'}"`,
  })

  const url = await getSignedUrl(s3, command, {
    expiresIn: DOWNLOAD_EXPIRY_SECONDS,
  })

  return NextResponse.json({ url })
}
