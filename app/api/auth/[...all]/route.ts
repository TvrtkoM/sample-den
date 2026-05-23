import { aj, protectOrAllow } from '@/lib/arcjet/server'
import { auth } from '@/lib/auth'
import { protectSignup, slidingWindow } from '@arcjet/next'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest } from 'next/server'

const baseHandler = toNextJsHandler(auth.handler)

const signupProtect = aj.withRule(
  protectSignup({
    email: {
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
    },
    bots: { mode: 'LIVE', allow: [] },
    rateLimit: { mode: 'LIVE', interval: '10m', max: 5 },
  }),
)

const signinProtect = aj.withRule(slidingWindow({ mode: 'LIVE', interval: '1m', max: 5 }))

export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.endsWith('/sign-up/email')) {
    const body = (await req.clone().json()) as { email?: string }
    const arcjetResponse = await protectOrAllow(
      () => {
        return signupProtect.protect(req, { email: body.email ?? '' })
      },
      { isAuth: true },
    )
    if (arcjetResponse) return arcjetResponse
  } else if (path.endsWith('/sign-in/email')) {
    const arcjetResponse = await protectOrAllow(
      () => {
        return signinProtect.protect(req)
      },
      { isAuth: true },
    )
    if (arcjetResponse) return arcjetResponse
  }

  return baseHandler.POST(req)
}

export const GET = baseHandler.GET
