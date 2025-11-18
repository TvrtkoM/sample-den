import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@sanity/client'

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

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN || '',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// ---------- POST ----------
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const wavFile = formData.get('wav') as File | null
    const mp3File = formData.get('mp3') as File | null
    const documentId = formData.get('documentId') as string | null

    if (!wavFile || !mp3File) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing wav or mp3 file' }),
        { status: 400, headers: corsHeaders },
      )
    }

    if (!documentId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing documentId' }),
        { status: 400, headers: corsHeaders },
      )
    }

    if (!wavFile.name.toLowerCase().endsWith('.wav')) {
      return new NextResponse(
        JSON.stringify({ error: 'Only .wav allowed for wav field' }),
        { status: 400, headers: corsHeaders },
      )
    }

    const nameWithoutExt = [...wavFile.name.split('.').slice(0, -1)].join(".");
    const fileName = `${Date.now()}-${nameWithoutExt}`;

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

    const asset = await sanity.assets.upload(
      'file',
      mp3Buffer,
      {
        filename: `${fileName}.mp3`,
        contentType: 'audio/mpeg',
      },
    )

    // ----- 3. Patch draft + published documents -----
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

    await sanity
      .transaction()
      .patch(documentId, patch)
      .commit()

    // ----- 4. Respond -----
    return new NextResponse(
      JSON.stringify({
        success: true,
        s3Key,
        assetId: asset._id,
        url: asset.url,
      }),
      { status: 200, headers: corsHeaders },
    )
  } catch (err: any) {
    console.error('[UPLOAD ERROR]', err)
    return new NextResponse(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders },
    )
  }
}
