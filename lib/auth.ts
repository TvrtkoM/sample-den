import "server-only"
import prisma from '@/lib/prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { anonymous, createAuthMiddleware } from 'better-auth/plugins'
import { getOAuthState } from "better-auth/api"
import { migrateCart } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-in/email') {
        const userId = ctx.context.newSession?.user.id;
        const anonymousUserId = ctx.body.anonymousId;
        if (anonymousUserId && userId) {
          await migrateCart(anonymousUserId, userId);
        }
        return;
      }
      if (ctx.path === '/callback/:id') {
        const additionalData = await getOAuthState()
        const anonymousUserId = additionalData?.anonymousId;
        const userId = ctx.context.newSession?.user.id;
        if (anonymousUserId && userId) {
          await migrateCart(anonymousUserId, userId);
        }
      }
    })
  },
  plugins: [anonymous()],
  experimental: {
    joins: true
  }
})