import { aj, protectOrAllow } from '@/lib/arcjet/server'
import { slidingWindow } from '@arcjet/next'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createClient } from '@sanity/client'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

const protect = aj.withRule(
  slidingWindow({
    mode: 'LIVE',
    interval: '1m',
    max: 3,
  }),
)

// ---------- AWS S3 ----------
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
})

// ---------- Sanity ----------
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2023-01-01',
  useCdn: false,
})

// ---------- CORS ----------
const ALLOWED_ORIGIN = process.env.SANITY_STUDIO_ORIGIN

const headers = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN || '',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-upload-signature, x-upload-timestamp',
  'Access-Control-Max-Age': '86400',
}

const HMAC_SECRET = process.env.UPLOAD_HMAC_SECRET

// compare 2 hex strings but do it in constant timing to prvent timing based attacs
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  const bufA = Buffer.from(a, 'hex')
  const bufB = Buffer.from(b, 'hex')
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function signPayload(message: string): string {
  const hmac = crypto.createHmac('sha256', HMAC_SECRET!)
  hmac.update(message)
  return hmac.digest('hex')
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

// ---------- POST ----------
export async function POST(req: NextRequest) {
  try {
    const arcjetResponse = await protectOrAllow(() => protect.protect(req))
    if (arcjetResponse) return arcjetResponse

    const contentLength = Number(req.headers.get('content-length'))
    if (!Number.isFinite(contentLength) || contentLength <= 0) {
      return new NextResponse('Missing or invalid Content-Length', { status: 411, headers })
    }
    if (contentLength > MAX_UPLOAD_BYTES) {
      return new NextResponse('Payload too large', { status: 413, headers })
    }

    const formData = await req.formData()
    const documentId = formData.get('documentId') as string | null

    if (!documentId) {
      return new NextResponse(JSON.stringify({ error: 'Missing documentId' }), { status: 400, headers })
    }

    if (!HMAC_SECRET) {
      return new NextResponse('Server misconfigured', { status: 500, headers })
    }

    const signature = req.headers.get('x-upload-signature')
    const timestamp = req.headers.get('x-upload-timestamp')

    if (!signature || !timestamp) {
      return new NextResponse('Missing auth headers', { status: 401, headers })
    }

    const now = Date.now()
    const tsNum = Number(timestamp)

    if (!Number.isFinite(tsNum)) {
      return new NextResponse('Invalid timestamp', { status: 401, headers })
    }

    const maxWindowMs = 5 * 60 * 1000
    if (Math.abs(now - tsNum) > maxWindowMs) {
      return new NextResponse('Request expired', { status: 401, headers })
    }

    const message = `${documentId}:${timestamp}`
    const expected = signPayload(message)

    if (!timingSafeEqualHex(expected, signature)) {
      return new NextResponse('Invalid signature', { status: 401, headers })
    }

    const wavFile = formData.get('wav') as File | null
    const mp3File = formData.get('mp3') as File | null

    if (!wavFile || !mp3File) {
      return new NextResponse(JSON.stringify({ error: 'Missing wav or mp3 file' }), { status: 400, headers })
    }

    if (!wavFile.name.toLowerCase().endsWith('.wav')) {
      return new NextResponse(JSON.stringify({ error: 'Only .wav allowed for wav field' }), { status: 400, headers })
    }

    const nameWithoutExt = [...wavFile.name.split('.').slice(0, -1)].join('.')
    const fileName = `${Date.now()}-${nameWithoutExt}`

    // ----- 1. Upload WAV to S3 -----
    const wavArrayBuffer = await wavFile.arrayBuffer()
    const wavBuffer = Buffer.from(wavArrayBuffer)
    const s3Key = `samples/${fileName}.wav`

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_PRIVATE_BUCKET!,
        Key: s3Key,
        Body: wavBuffer,
        ContentType: 'audio/wav',
      }),
    )

    // ----- 2. Upload MP3 to Sanity assets -----
    const mp3ArrayBuffer = await mp3File.arrayBuffer()
    const mp3Buffer = Buffer.from(mp3ArrayBuffer)

    const asset = await sanity.assets.upload('file', mp3Buffer, {
      filename: `${fileName}.mp3`,
      contentType: 'audio/mpeg',
    })

    // ----- 3. Patch document -----
    const patch = {
      set: {
        highResFile: {
          fileName: wavFile.name,
          s3Key,
          mp3AssetId: asset._id,
          mp3Url: asset.url,
        },
        previewFile: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      },
    }

    await sanity.transaction().patch(documentId, patch).commit()

    // ----- 4. Respond -----
    return NextResponse.json(
      {
        success: true,
        s3Key,
        assetId: asset._id,
        url: asset.url,
      },
      { status: 200, headers },
    )
  } catch (err: unknown) {
    console.error('[UPLOAD ERROR]', err)
    return NextResponse.json(null, { status: 500, headers })
  }
}
