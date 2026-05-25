import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'prisma/config'

let env = process.env.NODE_ENV
if (!env) {
  env = 'development'
}

const projectDir = process.cwd()
loadEnvConfig(projectDir, env === 'development')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
