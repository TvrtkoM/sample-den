import "server-only"
import prisma from '@/lib/prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { anonymous, createAuthMiddleware } from 'better-auth/plugins'
import { migrateCart } from "./db"
import { getAnonymousUserIdCookie } from "./utils"
import { sendEmail } from "./email/send-email"
import VerificationEmail from "@/emails/VerificationEmail"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => { }
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log('email verification url', url);
      sendEmail(user.email, "Verify your email", VerificationEmail({ verificationUrl: url }));
    }
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
      if (ctx.path === '/sign-in/email' || ctx.path === '/verify-email' || ctx.path === '/callback/:id') {
        const userId = ctx.context.newSession?.user.id;

        const cookieHeader = ctx.request?.headers.get('cookie') || '';

        const anonymousUserId = cookieHeader
          .split('; ')
          .find(c => c.startsWith('anonymous-user-id='))
          ?.split('=')[1];

        if (anonymousUserId && userId) {
          await migrateCart(anonymousUserId, userId);
          ctx.setHeader('Set-Cookie', getAnonymousUserIdCookie());
        }
      }
    })
  },
  plugins: [anonymous()],
  experimental: {
    joins: true
  }
})