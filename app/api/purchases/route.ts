import { getPurchasesMap } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const ids = (request.nextUrl.searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  return NextResponse.json({ purchases: await getPurchasesMap(ids) })
}
