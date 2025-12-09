import prisma from '@/lib/prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { anonymous } from 'better-auth/plugins'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [anonymous()],
  experimental: {
    joins: true
  }
})