import { aj, protectOrAllow } from '@/lib/arcjet/server'
import { getPurchaseMapForUser } from '@/lib/db'
import { getSession } from '@/lib/getSession'
import { detectBot, slidingWindow } from '@arcjet/next'
import { NextRequest, NextResponse } from 'next/server'

const protect = aj.withRule(detectBot({ mode: 'LIVE', allow: [] })).withRule(
  slidingWindow({
    mode: 'LIVE',
    interval: '1m',
    max: 30,
  }),
)

export async function POST(request: NextRequest) {
  const arcjetIpResponse = await protectOrAllow(() => {
    return protect.protect(request)
  })
  if (arcjetIpResponse) return arcjetIpResponse

  const session = await getSession()
  if (!session || session.user.isAnonymous) {
    return NextResponse.json({ purchases: {} })
  }

  const payload = (await request.json()) as { ids: string[] }

  const ids = [...new Set(payload.ids)].sort()

  return NextResponse.json({ purchases: await getPurchaseMapForUser(ids, session.user.id) })
}
