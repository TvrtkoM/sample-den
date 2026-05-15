import AppNavButtons from '@/components/AppNavButtons'
import PrivateGuard from '@/components/auth/PrivateGuard'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <PrivateGuard>
      <header className="border-b border-neutral-200">
        <div className="container py-6">
          <div className="flex justify-between mb-6">
            <h1>Profile</h1>
            <AppNavButtons />
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/profile">Overview</Link>
            <Link href="/profile/library">Library</Link>
          </nav>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </PrivateGuard>
  )
}
