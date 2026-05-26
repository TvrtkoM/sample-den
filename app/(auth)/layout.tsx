import PublicGuard from '@/components/auth/PublicGuard'
import ReloadOnAuthAction from '@/components/auth/ReloadOnSessionChange'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicGuard>
      <ReloadOnAuthAction />
      {children}
    </PublicGuard>
  )
}
